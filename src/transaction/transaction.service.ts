import { BadRequestException, Injectable } from '@nestjs/common';
import axios from 'axios';
import { GetTransactionsDto } from './dto/get-transactions.dto';
import {
  Order,
  PageDto,
  PageMetaDto,
} from 'src/common/pagination/pagination.types';

export type TTxType = 'SEND' | 'RECEIVE';
export type TTxStatus = 'PENDING' | 'COMPLETED';
export enum TOrderBy {
  DATE = 'DATE',
  AMOUNT = 'AMOUNT',
}

export type TTx = {
  type: TTxType;
  date: string;
  txId: string;
  amount: number;
  balance: number;
  status: TTxStatus;
};

const DEFAULT_BLOCKNUMBER = 845647;
const DEFAULT_TIME = '2024-05-29T13:57:40.319Z';

@Injectable()
export class TransactionService {
  async getTransactions(query: GetTransactionsDto): Promise<PageDto<TTx>> {
    try {
      const address = query.address;

      const url = `https://mempool.space/api/address/${address}/txs`;
      const { data: rawTransactions } = await axios.get(url);

      const transactions: TTx[] = [];
      let balance = 0;

      (rawTransactions as any[]).reverse().forEach((rawTransaction) => {
        const sendAmount = (rawTransaction.vin as any[]).reduce(
          (accumulator, input) => {
            return (
              accumulator +
              (input.prevout.scriptpubkey_address === address
                ? input.prevout.value
                : 0)
            );
          },
          0,
        );

        const receiveAmount = (rawTransaction.vout as any[]).reduce(
          (accumulator, output) => {
            return (
              accumulator +
              (output.scriptpubkey_address === address ? output.value : 0)
            );
          },
          0,
        );

        const amount = receiveAmount - sendAmount;
        balance += amount;

        const time = new Date(DEFAULT_TIME);
        const minutes = time.getMinutes();
        time.setMinutes(
          minutes +
            (rawTransaction.status.block_height - DEFAULT_BLOCKNUMBER) * 10,
        );

        const txId = rawTransaction.txid;

        transactions.push({
          amount,
          balance,
          date: time.toISOString(),
          status: 'COMPLETED',
          txId,
          type: amount > 0 ? 'RECEIVE' : 'SEND',
        });
      });

      transactions.sort((a, b) => {
        if (query.orderBy === TOrderBy.AMOUNT)
          return query.order === Order.DESC
            ? a.amount - b.amount
            : b.amount - a.amount;
        else if (query.orderBy === TOrderBy.DATE)
          return query.order === Order.DESC
            ? new Date(a.date).getTime() - new Date(b.date).getTime()
            : new Date(b.date).getTime() - new Date(a.date).getTime();
      });

      const data = transactions.slice(
        (query.page - 1) * query.take,
        query.page * query.take,
      );

      const pageMetaDto = new PageMetaDto({
        itemCount: transactions.length,
        pageOptionsDto: {
          skip: query.skip,
          order: query.order,
          page: query.page,
          take: query.take,
        },
      });

      return new PageDto(data, pageMetaDto);
    } catch (error) {
      throw new BadRequestException('Fetch error or Invalid Address');
    }
  }
}
