export function allowOnlyNumbers(event: KeyboardEvent): boolean {
  const charCode = event.which ? event.which : event.keyCode;
  const inputElement = event.target as HTMLInputElement;

  if ((charCode >= 48 && charCode <= 57) || charCode === 8 || charCode === 46) {
    return true;
  }
  event.preventDefault();
  return false;
}
