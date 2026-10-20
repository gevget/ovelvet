import { expect, test } from "@playwright/test";

test("all mapped routes render a meaningful heading without horizontal overflow", async ({ page }) => {
  const routes = [
    "/", "/stretch-walls/", "/home/", "/business/", "/technology/", "/projects/",
    "/projects/architectural-textile-lighting/", "/projects/textile-furniture-finish/",
    "/materials/", "/cost/", "/designers/", "/articles/",
    "/articles/care/", "/articles/business/", "/articles/wall-preparation/",
    "/articles/technology/", "/articles/repair/", "/articles/installation-time/",
    "/about/", "/contacts/", "/privacy/"
  ];
  const viewportWidths = [320, 390, 768, 1024, 1440, 1920];
  for (const route of routes) {
    await page.setViewportSize({ width: 1440, height: 900 });
    const response = await page.goto(route);
    expect(response?.status(), route).toBe(200);
    await expect(page.locator("main h1").first(), route).toBeVisible();
    for (const width of viewportWidths) {
      await page.setViewportSize({ width, height: width < 500 ? 844 : 900 });
      await expect(page.locator("main h1").first(), `${route} at ${width}px`).toBeVisible();
      const documentWidth = await page.evaluate(() => ({
        viewport: document.documentElement.clientWidth,
        content: document.documentElement.scrollWidth,
        bodyWidth: document.body.scrollWidth,
        bodyRectWidth: Math.round(document.body.getBoundingClientRect().width),
        wideContainers: Array.from(document.querySelectorAll<HTMLElement>("body *"))
          .filter((element) => element.scrollWidth > element.clientWidth + 2)
          .map((element) => ({
            element: `${element.tagName.toLowerCase()}.${Array.from(element.classList).join(".")}`,
            text: element.innerText?.trim().slice(0, 80),
            clientWidth: element.clientWidth,
            scrollWidth: element.scrollWidth,
            left: Math.round(element.getBoundingClientRect().left),
            right: Math.round(element.getBoundingClientRect().right)
          }))
          .slice(0, 10),
        overflowed: Array.from(document.querySelectorAll<HTMLElement>("body *"))
          .filter((element) => {
            const rect = element.getBoundingClientRect();
            return rect.right > document.documentElement.clientWidth + 1 || rect.left < -1;
          })
          .map((element) => ({
            element: `${element.tagName.toLowerCase()}.${Array.from(element.classList).join(".")}`,
            text: element.innerText?.trim().slice(0, 80),
            left: Math.round(element.getBoundingClientRect().left),
            right: Math.round(element.getBoundingClientRect().right),
            clientWidth: element.clientWidth,
            scrollWidth: element.scrollWidth,
            minWidth: getComputedStyle(element).minWidth
          }))
          .slice(0, 8),
        textBelowMinimum: Array.from(document.querySelectorAll<HTMLElement>("body *"))
          .filter((element) => {
            if (!element.textContent?.trim() || element.getClientRects().length === 0) return false;
            let current: HTMLElement | null = element;
            while (current) {
              const style = getComputedStyle(current);
              if (style.display === "none" || style.visibility === "hidden" || Number(style.opacity) === 0 || current.getAttribute("aria-hidden") === "true") return false;
              current = current.parentElement;
            }
            return Number.parseFloat(getComputedStyle(element).fontSize) < 13;
          })
          .map((element) => ({
            element: `${element.tagName.toLowerCase()}.${Array.from(element.classList).join(".")}`,
            text: element.innerText?.trim().slice(0, 80),
            fontSize: getComputedStyle(element).fontSize
          }))
          .slice(0, 8)
      }));
      expect(documentWidth.content, `${route} overflows at ${width}px: ${JSON.stringify(documentWidth)}`).toBeLessThanOrEqual(documentWidth.viewport);
      expect(documentWidth.textBelowMinimum, `${route} has visible text below 13px at ${width}px`).toEqual([]);
    }
  }
});

test("business estimate works without a known area and stays in demo mode", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/business/");
  await page.getByRole("link", { name: "Обсудить объект" }).click();
  await expect(page).toHaveURL(/\/cost\/?\?type=business$/);
  await expect(page.getByRole("button", { name: "Для бизнеса" })).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "Офис", exact: true }).click();
  await page.getByRole("button", { name: "Продолжить" }).click();
  await page.getByLabel("Площадь пока неизвестна").check();
  await page.getByRole("button", { name: "Продолжить" }).click();
  await expect(page.getByText(/площадь уточняется/)).toBeVisible();
  await page.getByLabel("Электронная почта").fill("preview@example.invalid");
  await page.getByLabel(/Тестовые данные нужны только для проверки формы/).check();
  await page.getByRole("button", { name: "Проверить запрос" }).click();
  await expect(page.getByText(/Демо: запрос не отправлен/)).toBeVisible();
});

test("home estimate keeps a known decimal area when returning to the previous step", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/home/");
  await page.getByRole("link", { name: "Рассчитать проект" }).click();
  await expect(page).toHaveURL(/\/cost\/?\?type=home$/);
  await expect(page.getByRole("button", { name: "Для дома" })).toHaveAttribute("aria-pressed", "true");
  await page.getByRole("button", { name: "Квартира", exact: true }).click();
  await page.getByRole("button", { name: "Продолжить" }).click();
  await page.getByLabel("Ориентировочная площадь стен, м²").fill("24,5");
  await page.getByRole("button", { name: "Продолжить" }).click();
  await expect(page.getByText(/24\.5 м²/)).toBeVisible();
  await page.getByRole("button", { name: "Назад" }).click();
  await expect(page.getByLabel("Ориентировочная площадь стен, м²")).toHaveValue("24,5");
});

test("contact leads stay disabled until an approved delivery channel exists", async ({ request }) => {
  const response = await request.post("/api/leads/", {
    data: {
      source: "contact",
      audience: "both",
      email: "preview@example.invalid",
      consentVersion: "preview-v1",
      consentGranted: true
    }
  });
  expect(response.status()).toBe(503);
  expect(await response.json()).toMatchObject({ code: "DEMO_DISABLED" });
});

test("unknown articles and projects are not published", async ({ page }) => {
  const article = await page.goto("/articles/care/");
  expect(article?.status()).toBe(200);
  await expect(page.locator("main h1")).toContainText("Как ухаживать");
  const unknownArticle = await page.goto("/articles/not-a-real-article/");
  expect(unknownArticle?.status()).toBe(404);
  const unknownProject = await page.goto("/projects/not-a-real-project/");
  expect(unknownProject?.status()).toBe(404);
  const unknownRoute = await page.goto("/nonexistent/");
  expect(unknownRoute?.status()).toBe(404);
});

test("mobile menu closes with Escape and returns focus", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/technology/");
  const trigger = page.locator('button[aria-controls="mobile-navigation"]');
  await trigger.click();
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  const wallLink = page.getByRole("navigation", { name: "Навигация по сайту" }).getByRole("link", { name: "Натяжные стены" });
  await expect(wallLink).toBeVisible();
  const [headerBox, linkBox] = await Promise.all([
    page.locator("header").boundingBox(),
    wallLink.boundingBox()
  ]);
  expect(headerBox).not.toBeNull();
  expect(linkBox).not.toBeNull();
  expect(linkBox!.y).toBeGreaterThanOrEqual(headerBox!.y + headerBox!.height + 20);
  await page.keyboard.press("Escape");
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
  await expect(trigger).toBeFocused();
});

test("desktop more menu closes on outside click and navigation", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const moreMenu = page.locator("details").filter({ hasText: "Ещё" });
  const trigger = moreMenu.locator("summary");

  await trigger.click();
  await expect(moreMenu).toHaveAttribute("open", "");
  await page.locator("main").click();
  await expect(moreMenu).not.toHaveAttribute("open", "");

  await trigger.click();
  await page.getByRole("navigation", { name: "Основная навигация" }).getByRole("link", { name: "Для бизнеса", exact: true }).click();
  await expect(page).toHaveURL(/\/business\/?$/);
  await expect(moreMenu).not.toHaveAttribute("open", "");

  await trigger.click();
  await moreMenu.getByRole("link", { name: "О компании", exact: true }).click();
  await expect(page).toHaveURL(/\/about\/?$/);
  await expect(moreMenu).not.toHaveAttribute("open", "");
});
