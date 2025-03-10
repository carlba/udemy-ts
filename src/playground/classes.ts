abstract class Department {
  // private id: string;
  // private name: string;
  static fiscalYear = 2020;

  // Protected means that the property is available in this class and classes that
  // extend it.
  protected employees: string[] = [];

  // This is the shorthand syntax for constructors. Parameters needs to be
  // declared with private or public before them. No further declaration of the
  // the properties is needed.
  constructor(protected readonly id: string, private name: string) {
    // this.id = id;
    // this.name = name;
  }

  static createEmployee(name: string) {
    return { name };
  }

  // This is not a real parameter that needs to be passed to the method
  // but it can be used to ensure that the describe method can only
  // be called from something that is similar to a Department class.
  abstract describe(this: Department): void;

  addEmployee(employee: string) {
    this.employees.push(employee);
  }
  printEmployeeInformation() {
    console.log(this.employees.length);
    console.log(this.employees);
  }
}

class ITDepartment extends Department {
  private admins: string[];
  constructor(id: string, admins: string[]) {
    super(id, 'it');
    this.admins = admins;
  }
  describe(this: ITDepartment): void {
    console.log(`IT Department - ID: ${this.id}`);
  }
}

class AccountingDepartment extends Department {
  private _lastReport: string;
  private static instance: AccountingDepartment;

  get lastReport() {
    if (this._lastReport) {
      return this._lastReport;
    } else {
      throw new Error('No report found');
    }
  }

  set lastReport(report: string) {
    if (!report) {
      throw new Error('Please provide a valid value');
    }
    this.addReports(report);
  }

  static getInstance() {
    return this.instance ? this.instance : new AccountingDepartment('d2', []);
  }

  private constructor(id: string, private reports: string[]) {
    super(id, 'accounting');
    this._lastReport = reports[0];
  }

  describe() {
    console.log(`Accounting Department - ID: ${this.id}`);
  }

  addEmployee(name: string) {
    if (name === 'Carl') {
      return;
    }
    this.employees.push(name);
  }

  addReports(report: string) {
    this.reports.push(report);
    this._lastReport = report;
  }

  printReports() {
    console.log('Printing reports: ', this.reports.join(', '));
  }
}

// This no longer works since abstract classes are not meant to be instantiated only to be
// extended from.

// const engineering = new Department('1', 'engineering');

const employee = Department.createEmployee('Carl');
console.log(employee);

console.log(Department.fiscalYear);

const it = new ITDepartment('2', ['Carl']);
// @ts-ignore
it.employees[1] = 'Tobias';
it.printEmployeeInformation();

const accounting = AccountingDepartment.getInstance();

accounting.describe();

try {
  console.log(accounting.lastReport);
} catch (error) {
  console.log(error);
}

accounting.addReports('Something went wrong');
console.log(accounting.lastReport);
accounting.lastReport = 'Something went more wrong';
console.log(accounting.lastReport);
accounting.printReports();
accounting.addEmployee('Carl');
accounting.addEmployee('Johanna');
// This will only show Johanna since Carl is not allowed the addEmployees method of the
// AccountingDepartment class.
accounting.printEmployeeInformation();
