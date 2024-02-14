import { buildMessage, ValidateBy, ValidationOptions } from 'class-validator';

export const MIN_DATE = 'minDate';

/**
 * Checks if the value is a date that's after the specified date without considering time.
 */
export function minDate(date: unknown, minDate: Date): boolean {
  const dateObject: Date = typeof date === 'string' ? new Date(date) : <Date>date;

  // Set the time to midnight (00:00:00)
  dateObject.setHours(0, 0, 0, 0);
  minDate.setHours(0, 0, 0, 0);

  return dateObject instanceof Date && dateObject.getTime() >= minDate.getTime();
}

/**
 * Checks if the value is a date that's after the specified date without considering time.
 */
export function MinDate(date: Date, validationOptions?: ValidationOptions): PropertyDecorator {
  return ValidateBy(
    {
      name: MIN_DATE,
      constraints: [date],
      validator: {
        validate: (value, args): boolean => minDate(value, args.constraints[0]),
        defaultMessage: buildMessage(
          (eachPrefix) => 'minimal allowed date for ' + eachPrefix + '$property is $constraint1',
          validationOptions,
        ),
      },
    },
    validationOptions,
  );
}
