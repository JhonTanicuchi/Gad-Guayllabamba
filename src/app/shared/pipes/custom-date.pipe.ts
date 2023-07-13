import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'customDate',
})
export class CustomDatePipe implements PipeTransform {
  transform(date: any): string {
    const inputDate = new Date(date);
    const day = inputDate.getDate();
    const monthIndex = inputDate.getMonth();
    const year = inputDate.getFullYear();
    const monthNames = [
      'enero',
      'febrero',
      'marzo',
      'abril',
      'mayo',
      'junio',
      'julio',
      'agosto',
      'septiembre',
      'octubre',
      'noviembre',
      'diciembre',
    ];
    return `${day} de ${monthNames[monthIndex]} de ${year}`;
  }
}
