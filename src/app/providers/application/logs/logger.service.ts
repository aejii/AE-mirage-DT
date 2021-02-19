import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoggerService {
  private readonly LOGS_LS_KEY = 'mirageold-logs';

  private readonly logsOfTodayName = (() => {
    const d = new Date();
    const day = d.getDate();
    const month = d.getMonth() + 1;
    const year = d.getFullYear();

    return `${day}/${month}/${year}`;
  })();

  private logsOfToday = new BehaviorSubject<string[]>([]);
  logs$ = this.logsOfToday.asObservable();

  constructor() {}

  initializeLogger() {
    const allLogs: LocalStorageLogs = JSON.parse(
      window.localStorage.getItem(this.LOGS_LS_KEY) ?? '{}',
    );

    this.logsOfToday.next(allLogs[this.logsOfTodayName] ?? []);

    (window as any).mgLog = (...args) => {
      const buildStr = args
        .map((arg) => {
          try {
            return JSON.stringify(arg, null, 4);
          } catch (error) {
            return '- [JSON STRINGIFY ERROR] -';
          }
        })
        .join(' ');

      const logs = this.logsOfToday.value;
      logs.push(buildStr);

      window.localStorage.setItem(
        this.LOGS_LS_KEY,
        JSON.stringify(
          {
            [this.logsOfTodayName]: logs,
          },
          null,
          4,
        ),
      );

      this.logsOfToday.next(logs);
    };
  }
}

interface LocalStorageLogs {
  [key: string]: string[];
}
