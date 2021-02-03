import { Component, OnInit, ɵdetectChanges, Input, Output, EventEmitter, ApplicationRef } from '@angular/core';
import { range } from 'rxjs';
import { CategoriesService } from '../../Services/categories.service';
import { UserService } from 'src/app/Services/user.service';
import { NativeAudio } from '@ionic-native/native-audio/ngx';

@Component({
  selector: 'app-card-set',
  templateUrl: './card-set.component.html',
  styleUrls: ['./card-set.component.scss']
})
export class CardSetComponent implements OnInit {

  constructor(private nativeAudio: NativeAudio, private userService: UserService, private cat: CategoriesService, private appRef: ApplicationRef) { }
  @Output() Spinning = new EventEmitter<boolean>();

  canSpin = true;
  categoryName = "";
  itemsQueue = new Array(8).fill({ name: "", img: "", color: "" }); //card set information
  state = "start";  // the state of the card set

  flipped = 0;
  ngOnInit() {
    // preload sounds effects
    for (let i = 0; i < 8; i++)
      this.nativeAudio.preloadSimple(`cardflip${i}`, `assets/sfx/cardflip.wav`);

    this.nativeAudio.preloadSimple(`won`, `assets/sfx/won.wav`);
    this.nativeAudio.preloadSimple('return', `assets/sfx/card-return.mp3`);
  }

  init() {
    // get default category
    CategoriesService.curCategory = Object.keys(CategoriesService.items)[0];
    this.categoryName = CategoriesService.curCategory;

    // initate item queue values
    for (let i = 0; i < 8; i++)
      this.spinOnce();

    // play opening animation
    setTimeout(() => this.state = "opening", 300);

    // play idle animation
    setTimeout(() => {
      this.state = "idle"
    }, 1700);
  }



  // track animation time and sound
  time = 0;
  spinForce = 0;
  soundIndex = 0;
  // spin the cards
  spin(force, reset = false) {
    if (!(this.state == "idle" || this.state == "spinning"))
      return;

    if (force <= 0) {

      this.spinOnce();
      this.time = 0;
      let result = this.itemsQueue[3];
      result.category = this.categoryName;
      this.userService.recordSpin(result);
      setTimeout(() => {
        this.nativeAudio.play('won');
        this.playExplosionAnimation();
        this.state = "ended";
        this.canSpin = true;
        this.Spinning.emit(false);
      }, this.speed());
      return;
    }

    if (!this.canSpin && reset) return;

    this.nativeAudio.play(`cardflip${this.soundIndex}`);
    this.soundIndex = (this.soundIndex + 1) % 8;
    this.canSpin = false;

    if (reset) {
      this.spinForce = force + 2;
      this.time = force;
      this.Spinning.emit(true);
    }
    else this.spinOnce();

    this.time = force;

    setTimeout(() => {
      this.spin(force - 1);
    }, this.speed());

  }
  // shift the values of the queue
  spinOnce(toRight = true) {
    if (toRight) {
      this.itemsQueue.push(this.pickItem());
      this.itemsQueue.splice(0, 1)
    }
    else {
      this.itemsQueue.pop();
      this.itemsQueue.splice(0, 0, this.pickItem());

    }
  }

  // change category
  dirCategory;
  changeCategory(name) {
    if (this.state == "start")
      return;

    this.dirCategory = name;

    if (this.flipped != 0 || name == this.categoryName)
      return;

    this.flipped = 1;
    this.canSpin = false;
    this.nativeAudio.play('cardflip0');

    setTimeout(() => {
      this.categoryName = name;
      this.itemsQueue = [];

      for (let i = 0; i < 8; i++)
        this.itemsQueue.push(this.pickItem());

      this.flipped = -1;

    }, 1100);

    setTimeout(() => {
      this.flipped = 0;
      this.changeCategory(this.dirCategory);
      this.canSpin = true;
    }, 1600);
  }



  // card animation function
  cardAnimation(n) {
    let isSideCard = (n == 0 || n == 6);
    // if its the start of the animation
    if (this.state == "start" && !isSideCard) {
      return {
        "animation": `flip${n} 0s  forwards`
      }
    }

    if (this.state == "opening" && !isSideCard) {
      return {
        "animation": `flipback${n} ${(7 - n) * 180}ms forwards`
      }
    }

    let animation = (this.time == 0 ? `nothing 0ms` : `card${n}-left ${this.speed() / 1.2}ms forwards`);
    if (this.flipped != 0 && n != 0 && n != 6) animation += `, ${this.flipped == 1 ? `flip${n}` : `flipback${n}`} ${(7 - n) * 180}ms forwards`;

    if (this.reseting) {
      if (n == 3) {
        return {
          "animation": "returned 1s"
        }
      }
      else if (n > 0 && n < 6) {
        return {
          "animation": `flipback${n} 1s`
        }
      }
    }

    if (this.state == "ended") {
      if (n == 3) {
        return {
          "animation": "picked 1s  forwards"
        }
      }
      else if (n > 0 && n < 6) {
        return {
          "animation": `flip${n} 1s  forwards`
        }
      }
    }
    return {
      "animation": animation
    }
  }

  // return the time for each shift
  speedShift = 3;
  speed() {
    return (this.spinForce * this.spinForce - this.time * this.time) / this.speedShift;
  }

  reseting = false;

  // reset the card set
  reset() {
    this.nativeAudio.play('cardflip0');
    this.reseting = true;
    setTimeout(() => {
      this.reseting = false;
      this.state = "idle";
    }, 1000);
  }

  // pick random item from the category list
  pickItem() {
    let length = CategoriesService.items[this.categoryName].length;
    let item = Math.floor(Math.random() * length);
    return { ...CategoriesService.items[this.categoryName][item] };
  }

  //***************************************************************************/
  //********* explosion effect (planned to move to seperate component *********/
  //***************************************************************************/
  colors = ['#ffc000', '#ff3b3b', '#ff8400'];
  bubbles = 22;
  explosinPoints = Array(11).fill(null);

  // explosion
  explode(index, x, y) {
    let particles = [];
    let ratio = window.devicePixelRatio;
    let c;

    if (this.explosinPoints[index] == null) {
      c = document.createElement('canvas');
      c.setAttribute("class", "fireworks");
      c.width = 200 * ratio;
      c.height = 200 * ratio;
      this.explosinPoints[index] = c;
      document.body.appendChild(c);
    }
    else {
      c = this.explosinPoints[index];
    }

    let ctx = c.getContext('2d');
    c.style.left = (x - 100) + 'px';
    c.style.top = (y - 100) + 'px';

    for (var i = 0; i < this.bubbles; i++) {
      particles.push({
        x: c.width / 2,
        y: c.height / 2,
        radius: this.r(15, 25, 0),
        color: this.colors[Math.floor(Math.random() * this.colors.length)],
        rotation: this.r(0, 360, 0),
        speed: this.r(8, 12, 0),
        friction: 0.9,
        opacity: this.r(0, 0.5, 0),
        yVel: 0,
        gravity: 0.1
      });
    }

    this.render(particles, ctx, c.width, c.height);
  }

  // render a particle explosion 
  render(particles, ctx, width, height) {
    requestAnimationFrame(() => this.render(particles, ctx, width, height));
    ctx.clearRect(0, 0, width, height);

    particles.forEach((p, i) => {
      p.x += p.speed * Math.cos(p.rotation * Math.PI / 180);
      p.y += p.speed * Math.sin(p.rotation * Math.PI / 180);

      p.opacity -= 0.01;
      p.speed *= p.friction;
      p.radius *= p.friction;
      p.yVel += p.gravity;
      p.y += p.yVel;

      if (p.opacity < 0 || p.radius < 0) return;

      ctx.beginPath();
      ctx.globalAlpha = p.opacity;
      ctx.fillStyle = p.color;
      ctx.arc(p.x, p.y, p.radius, 0, 2 * Math.PI, false);
      ctx.fill();
    });

    return ctx;
  }

  r = (a, b, c: 0) => parseFloat((Math.random() * ((a ? a : 1) - (b ? b : 0)) + (b ? b : 0)).toFixed(c ? c : 0));

  // play explosion animation
  playExplosionAnimation() {
    let height = window.innerHeight;
    let width = window.innerWidth;
    let count = Math.random() * 5 + 5;
    let delay = 140;

    // generate explosion in random places
    for (let i = 0; i < count; i++) {
      let xDir = Math.random() > 0.5 ? 1 : -1;
      let yDir = Math.random() > 0.5 ? 1 : -1;
      setTimeout(() => {
        this.explode(i, width / 2 + width / 8 * xDir + Math.random() * width / 6 * xDir, height / 2 + height / 8 * yDir + Math.random() * height / 6 * yDir);
      }, delay);
      delay += Math.random() * 200 + 100;
    }

  }

}
