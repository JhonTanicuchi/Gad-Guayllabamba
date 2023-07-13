import { Component, OnInit, ViewChild } from '@angular/core';

import { DatePipe } from '@angular/common';

import { ApexAxisChartSeries, ApexDataLabels, ApexFill, ApexPlotOptions, ApexTitleSubtitle, ApexXAxis, ApexYAxis, ChartComponent } from "ng-apexcharts";
import {
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexChart
} from "ng-apexcharts";
import { HttpClient } from '@angular/common/http';
import { OficiosService } from '../oficios/oficios.service';



@Component({
  selector: 'app-oficios-list',
  templateUrl: './oficio.stadistic.component.html',
  styleUrls: ['./oficio.stadistic.component.css'],
})
export class OficioStadisticComponent implements OnInit {
  cantidadRealizados: number;
  cantidadArchivados: number;
  cantidadPendientes: number;
  cantidadFinalizados: number;

  chartSeries: ApexNonAxisChartSeries;
  chartDetails: ApexChart = {
    type: 'pie',
    toolbar: {
      show: true
    }
  };

  chartLabels = [ "Realizados",
  "Finalizados",
  "Pendientes",
  "Archivados"];

  chartTitle: ApexTitleSubtitle = {
    text: 'OFICIOS TOTALES',
    align: 'center'
  };

  chartDataLabels = {
    enabled: true,
    formatter: (val: any, opts: any) => {
      return opts.w.config.series[opts.seriesIndex];
    }
  };

 

  constructor(
    
    private http: HttpClient,
    private oficiosService: OficiosService,

    ) {
    
    this.obtenerCantidadRealizados();
    this.obtenerCantidadArchivados();
    this.obtenerCantidadPendientes();
    this.obtenerCantidadFinalizados()
   }

  ngOnInit(): void {
    console.log("listo")
  }
  obtenerCantidadRealizados() {
    this.oficiosService.getOficios().subscribe(
      (res: any) => {
        this.cantidadRealizados = res.data.total;
        console.log(this.cantidadRealizados);
        this.chartSeries = [this.cantidadRealizados];
      },
      error => {
        console.error('Error al obtener la cantidad de documentos realizados', error);
      }
    );
  }

  obtenerCantidadArchivados() {
    this.oficiosService.getArchivedOficios().subscribe(
      (res: any) => {
        this.cantidadArchivados = res.data.total;
        console.log(this.cantidadArchivados);
        this.chartSeries = [this.cantidadRealizados,this.cantidadFinalizados,this.cantidadPendientes,this.cantidadArchivados];
      },
      error => {
        console.error('Error al obtener la cantidad de documentos archivados', error);
      }
    );
  }
  obtenerCantidadFinalizados() {
    this.oficiosService.getOficiosByStatus('Finalizado').subscribe(
      (res: any) => {
        this.cantidadFinalizados = res.data.total;
        console.log(this.cantidadFinalizados);
        this.chartSeries = [this.cantidadRealizados,this.cantidadFinalizados,this.cantidadPendientes,this.cantidadArchivados];
      },
      error => {
        console.error('Error al obtener la cantidad de documentos archivados', error);
      }
    );
  }
  obtenerCantidadPendientes() {
    this.oficiosService.getOficiosByStatus('Pendiente').subscribe(
      (res: any) => {
        this.cantidadPendientes = res.data.total;
        console.log(this.cantidadPendientes);
        this.chartSeries = [this.cantidadRealizados,this.cantidadFinalizados,this.cantidadPendientes,this.cantidadArchivados];
      },
      error => {
        console.error('Error al obtener la cantidad de documentos archivados', error);
      }
    );
  }
 
}
