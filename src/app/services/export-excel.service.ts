import { Injectable } from '@angular/core';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import { Card } from '../models/card';

@Injectable({
  providedIn: 'root'
})
export class ExportExcelService {

  constructor() { }

  exportCard(cards: Card[]) {
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Cards');

    let item = {
      Id: cards[0].id!,
      Code: cards[0].code!,
      Name: cards[0].name,
      Detail: cards[0].description,
      Price: cards[0].price.toFixed(2),
      Events: cards[0].event!,
      Recipients: cards[0].recipient!,
      Active: cards[0].active ? 'Yes' : 'No',
      BestSeller: cards[0].bestseller ? 'Yes' : 'No',
      Featured: cards[0].featured ? 'Yes' : 'No'
    }

    let header = worksheet.addRow(Object.keys(item));
    header.eachCell((cell, number) => {
      cell.font = {
        bold: true
      }
    });

    cards.forEach(card => {
      let item = {
        Id: card.id!,
        Code: card.code!,
        Name: card.name,
        Detail: card.description,
        Price: card.price.toFixed(2),
        Events: card.event!,
        Recipients: card.recipient!,
        Active: card.active ? 'Yes' : 'No',
        BestSeller: card.bestseller ? 'Yes' : 'No',
        Featured: card.featured ? 'Yes' : 'No'
      };

      worksheet.addRow(Object.values(item));
    });

    worksheet.getColumn(1).width = 22;
    worksheet.getColumn(1).alignment = {
      horizontal: 'left'
    }

    worksheet.getColumn(2).width = 8;
    worksheet.getColumn(2).alignment = {
      horizontal: 'right'
    }

    worksheet.getColumn(3).width = 40;
    worksheet.getColumn(3).alignment = {
      horizontal: 'left'
    }

    worksheet.getColumn(4).width = 85;
    worksheet.getColumn(4).alignment = {
      horizontal: 'left'
    }

    worksheet.getColumn(5).width = 8;
    worksheet.getColumn(5).alignment = {
      horizontal: 'right'
    }

    worksheet.getColumn(6).width = 18;
    worksheet.getColumn(6).alignment = {
      horizontal: 'left'
    }

    worksheet.getColumn(7).width = 18;
    worksheet.getColumn(7).alignment = {
      horizontal: 'left'
    }

    worksheet.getColumn(8).width = 10;
    worksheet.getColumn(8).alignment = {
      horizontal: 'center'
    }

    worksheet.getColumn(9).width = 10;
    worksheet.getColumn(9).alignment = {
      horizontal: 'center'
    }

    worksheet.getColumn(10).width = 10;
    worksheet.getColumn(10).alignment = {
      horizontal: 'center'
    }

    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, 'Cards.xlsx');
    })
  }
}
