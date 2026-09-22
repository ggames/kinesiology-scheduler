import { Controller, Get, Query } from '@nestjs/common';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  /**
   * GET /reports/absenteeism
   * Reporte de ausentismo y abandono de pacientes
   */
  @Get('absenteeism')
  async getAbsenteeismReport(
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('professionalId') professionalId?: string,
  ) {
    return this.reportsService.getAbsenteeismReport({ from, to, professionalId });
  }

  /**
   * GET /reports/schedule-occupancy
   * Reporte de ocupación de agenda (slots asignados vs libres)
   */
  @Get('schedule-occupancy')
  async getScheduleOccupancyReport(
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('professionalId') professionalId?: string,
  ) {
    return this.reportsService.getScheduleOccupancyReport({ from, to, professionalId });
  }

  /**
   * GET /reports/consolidated
   * Reporte consolidado general
   */
  @Get('consolidated')
  async getConsolidatedReport(
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('professionalId') professionalId?: string,
  ) {
    return this.reportsService.getConsolidatedReport({ from, to, professionalId });
  }
}
