import { test, expect } from '@playwright/test';
import { mkdir } from 'node:fs/promises';

test('shows current-instance metrics, refreshes and fits the viewport', async ({ page }, testInfo) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Cloud DevOps Lab');
  await expect(page.getByRole('status')).toHaveText('Respondendo');
  await expect(page.locator('#environment')).toHaveText('local');
  await expect(page.locator('#memory')).toHaveText(/\d+\.\d MiB/);
  await expect(page.locator('#runtime')).toHaveText(/Node\.js \d+/);
  await page.getByRole('button', { name: 'Atualizar métricas' }).click();
  await expect(page.getByRole('status')).toHaveText('Respondendo');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  expect(errors).toEqual([]);
  await mkdir('artifacts', { recursive: true });
  await page.screenshot({ path: `artifacts/dashboard-${testInfo.project.name}.jpg`, type: 'jpeg', quality: 85, fullPage: true });
});

test('clears stale health and recovers after a failed metrics request', async ({ page }, testInfo) => {
  await page.goto('/');
  await expect(page.getByRole('status')).toHaveText('Respondendo');
  await page.route('**/api/runtime', route => route.abort('failed'));
  await page.getByRole('button', { name: 'Atualizar métricas' }).click();
  await expect(page.getByRole('status')).toHaveText('Sem confirmação');
  await expect(page.locator('#memory')).toHaveText('—');
  await expect(page.locator('#environment')).toHaveText('—');
  await expect(page.getByRole('button', { name: 'Atualizar métricas' })).toBeEnabled();
  await mkdir('artifacts', { recursive: true });
  await page.screenshot({ path: `artifacts/dashboard-unavailable-${testInfo.project.name}.jpg`, type: 'jpeg', quality: 85, fullPage: true });
  await page.unroute('**/api/runtime');
  await page.getByRole('button', { name: 'Atualizar métricas' }).click();
  await expect(page.getByRole('status')).toHaveText('Respondendo');
  await expect(page.locator('#environment')).toHaveText('local');
});
