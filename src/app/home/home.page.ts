import { Component } from '@angular/core';

import { Capacitor } from '@capacitor/core';
import { Plugins } from '@capacitor/core';

import { Geolocation } from '@capacitor/geolocation';


declare var nfc: any;


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  nfcNumber: string = '';

  constructor() {}

  ionViewDidEnter() {
    this.getNfcNumber()
      .then((nfcNumber) => {
        this.nfcNumber = nfcNumber;
      })
      .catch((error) => {
        console.error('Error getting NFC number:', error);
      });
  }

  onNfcEvent(event: any) {
    console.log('NFC Event:', event);
  }

  getNfcNumber(): Promise<string> {
    return new Promise((resolve, reject) => {
      // Check if NFC is supported
      if ('nfc' in window) {
        const nfcInstance = (window as any).nfc;

        // Add an event listener to handle reading NFC data
        document.addEventListener('deviceready', () => {
          nfcInstance.addNdefListener(
            (nfcEvent: any) => {
              const ndefMessage = nfcEvent.tag.ndefMessage;
              if (ndefMessage && ndefMessage.length > 0) {
                // Assuming the NFC tag contains only one record
                const record = ndefMessage[0];
                const nfcNumber = this.bytesToString(record.payload);
                resolve(nfcNumber);
              } else {
                reject('No NFC data found');
              }
            },
            () => {
              reject('Error adding NFC listener');
            }
          );
        });
      } else {
        reject('NFC not supported on this device');
      }
    });
  }

  bytesToString(bytes: Uint8Array): string {
    let result = '';
    bytes.forEach((byte) => {
      result += String.fromCharCode(byte);
    });
    return result;
  }

  sendEmail() {
    const { Device } = Plugins;
  
    (Device as any)['getInfo']().then((info: any) => {
      if (info.platform === 'web') {
        // Handle web platform
        window.location.href = 'mailto:recipient@example.com?subject=Email Subject&body=Hello, this is the email body.';
      } else {
        // Handle other platforms
        const emailUrl = 'mailto:recipient@example.com?subject=Email Subject&body=Hello, this is the email body.';
        window.open(emailUrl, '_system');
      }
    });
  }


  //LOCATION 
  async trackLocation() {
    const coor = await Geolocation.getCurrentPosition();
  }




}
