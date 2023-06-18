export class MealsWeek {
  constructor() {
    this.days = {
      monday: new Meals(),
      thursday: new Meals(),
      wednesday: new Meals(),
      tuesday: new Meals(),
      friday: new Meals(),
      saturday: new Meals(),
      sunday: new Meals(),
    };
  }
}

export class Meals {
  constructor() {
    this.breakfast = [];
    this.lunch = [];
    this.snack = [];
    this.dinner = [];
  }
}

export class Food {
  constructor() {
    this._id = [];
    this.name = [];
    this.picture = [];
    this.calories = [];
    this.quantity = [];
  }
}
