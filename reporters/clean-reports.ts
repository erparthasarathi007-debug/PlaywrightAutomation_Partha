import { rm } from 'node:fs/promises';
import path from 'node:path';

export default async function cleanReports(): Promise<void> {
  const reportsDir = path.resolve(process.cwd(), 'reports');
  await Promise.all(
    ['html', 'allure-results', 'test-results', 'named-results'].map((directory) =>
      rm(path.join(reportsDir, directory), { recursive: true, force: true }),
    ),
  );
}
