import { Controller, Get, HttpStatus, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';

import { TransactionService } from './transaction.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { TTx } from './transaction.service';

import { GetTransactionsDto } from './dto/get-transactions.dto';
import { PageDto } from 'src/common/pagination/pagination.types';
import { ApiResponseHelper } from 'src/common/helpers/api-response.helper';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Get('')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiResponse(ApiResponseHelper.success(PageDto<TTx>, HttpStatus.OK))
  @ApiResponse(ApiResponseHelper.validationError(`Validation failed`))
  @ApiOperation({
    description: `Get transactions from address`,
    tags: ['Transaction'],
  })
  async getTransactions(
    @Query() query: GetTransactionsDto,
  ): Promise<PageDto<TTx>> {
    return this.transactionService.getTransactions(query);
  }
}
