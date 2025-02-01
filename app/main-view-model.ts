import { Observable } from '@nativescript/core';
import { formatDistance } from 'date-fns';

export class BirthdayViewModel extends Observable {
  private targetDate = new Date('2025-02-07T00:00:00');
  private _countdownText: string = '';
  private _currentImage: string = '';
  private _birthdayMessage: string = '';
  private _imageAnimation: string = '';
  private _messageAnimation: string = '';
  private _images: string[] = [
    'https://placekitten.com/800/800',
    'https://placekitten.com/801/801',
    'https://placekitten.com/802/802',
    'https://placekitten.com/803/803',
    'https://placekitten.com/804/804',
    'https://placekitten.com/805/805',
    'https://placekitten.com/806/806',
    'https://placekitten.com/807/807',
    'https://placekitten.com/808/808',
    'https://placekitten.com/809/809'
  ];

  constructor() {
    super();
    this.startCountdown();
    this._currentImage = this._images[0];
    this.checkBirthdayAndNotify();
  }

  get countdownText(): string {
    return this._countdownText;
  }

  get currentImage(): string {
    return this._currentImage;
  }

  get birthdayMessage(): string {
    return this._birthdayMessage;
  }

  get images(): string[] {
    return this._images;
  }

  get imageAnimation(): string {
    return this._imageAnimation;
  }

  get messageAnimation(): string {
    return this._messageAnimation;
  }

  private startCountdown() {
    const updateCountdown = () => {
      const now = new Date();
      if (now >= this.targetDate) {
        this._countdownText = "🎉 Happy Birthday! 🎉";
        this.notifyPropertyChange('countdownText', this._countdownText);
        this.startBirthdayCelebration();
      } else {
        this._countdownText = formatDistance(this.targetDate, now, { addSuffix: true });
        this.notifyPropertyChange('countdownText', this._countdownText);
        setTimeout(updateCountdown, 1000);
      }
    };
    updateCountdown();
  }

  private startBirthdayCelebration() {
    this._birthdayMessage = "🎂 Happy Birthday! May all your wishes come true! 🎈";
    this.notifyPropertyChange('birthdayMessage', this._birthdayMessage);
    
    let currentIndex = 0;
    setInterval(() => {
      currentIndex = (currentIndex + 1) % this._images.length;
      this._currentImage = this._images[currentIndex];
      this.notifyPropertyChange('currentImage', this._currentImage);
    }, 3000);
  }

  private checkBirthdayAndNotify() {
    const now = new Date();
    if (now.getFullYear() === 2025 && now.getMonth() === 1 && now.getDate() === 7) {
      // Show local notification
      const LocalNotifications = require("@nativescript/local-notifications").LocalNotifications;
      LocalNotifications.schedule([{
        id: 1,
        title: '🎉 Happy Birthday!',
        body: 'Your special day has arrived! Open the app to celebrate!',
        badge: 1
      }]);
    }
  }

  onImageTap(args: any) {
    const index = args.index;
    this._currentImage = this._images[index];
    this.notifyPropertyChange('currentImage', this._currentImage);
  }
}