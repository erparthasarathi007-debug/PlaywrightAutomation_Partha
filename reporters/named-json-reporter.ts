import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import type { FullResult, Reporter, TestCase, TestResult } from '@playwright/test/reporter';

type TestRun = {
  test: TestCase;
  attempts: TestResult[];
};

type ReporterOptions = {
  outputFolder: string;
};

class NamedJsonReporter implements Reporter {
  private readonly outputFolder: string;
  private readonly testRuns = new Map<string, TestRun>();

  constructor(options: ReporterOptions) {
    this.outputFolder = path.resolve(options.outputFolder);
  }

  onTestEnd(test: TestCase, result: TestResult): void {
    const run = this.testRuns.get(test.id) ?? { test, attempts: [] };
    run.attempts.push(result);
    this.testRuns.set(test.id, run);
  }

  async onEnd(_result: FullResult): Promise<void> {
    await mkdir(this.outputFolder, { recursive: true });

    for (const { test, attempts } of this.testRuns.values()) {
      const latestAttempt = attempts[attempts.length - 1];
      const relativeFile = path.relative(process.cwd(), test.location.file);
      const testTitle = test.titlePath().join(' ');
      const filename = [relativeFile, testTitle]
        .join(' ')
        .replace(/[^a-zA-Z0-9._-]+/g, '-')
        .replace(/^-|-$/g, '')
        .slice(0, 180);

      const report = {
        title: test.title,
        titlePath: test.titlePath(),
        file: relativeFile,
        project: test.parent.project()?.name,
        expectedStatus: test.expectedStatus,
        status: latestAttempt.status,
        durationMs: latestAttempt.duration,
        attempts: attempts.map((attempt) => ({
          retry: attempt.retry,
          status: attempt.status,
          durationMs: attempt.duration,
          errors: attempt.errors.map((error) => error.message),
          attachments: attempt.attachments.map(({ name, contentType, path: attachmentPath }) => ({
            name,
            contentType,
            path: attachmentPath,
          })),
        })),
      };

      await writeFile(
        path.join(this.outputFolder, `${filename}.json`),
        `${JSON.stringify(report, null, 2)}\n`,
      );
    }
  }
}

export default NamedJsonReporter;
