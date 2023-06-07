import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { Products } from './shared/products.model';

export interface ShoppingCart{
  item: Products,
  amount: number,
  total: number
}

@Injectable({
  providedIn: 'root'
}) 
export class DataService {
  // Observable string sources
  constructor(){
    this.currentTotalPrice$ = this.currentProductsCart$.pipe(map(lista => lista.reduce((current, value) => {
      return current + value.total;
    }, 0)))
  }
  private currentProductInfo = new BehaviorSubject<Products>(null);
  private currentProductAmount = new BehaviorSubject<number>(0);
  //private currentTotalPrice = new BehaviorSubject<number>(0);

  //Observable cart items
  private currentProductsCart = new BehaviorSubject<ShoppingCart[]>([])

  // Observable string streams
  currentProductInfo$ = this.currentProductInfo.asObservable();
  currentProductAmount$ = this.currentProductAmount.asObservable();
  currentProductsCart$ = this.currentProductsCart.asObservable();
  currentTotalPrice$;

  // Service message commands
  emitChangeCurrentProductInfo(info: any) {
      this.currentProductInfo.next(info);
  }

  emitChangeCurrentProductAmount(amount: number){
    this.currentProductAmount.next(amount);
  }

  addProductToCart(info: Products, amount: number){
    let productCart = this.currentProductsCart.value;
    let currentProd = productCart.findIndex(prod => prod.item.name === info.name);
    let prod = productCart[currentProd];
    if(currentProd > -1){
        prod.amount += amount;
        prod.total = (info.price - (info.price * info.discount)) * prod.amount;
    } else{
      if(amount != 0){
        let totalCalculation = (info.price - (info.price * info.discount)) * amount;
        productCart.push({item: info, amount: amount, total: totalCalculation});
      }
    }
    this.currentProductsCart.next(productCart);
  }

  deleteProduct(currentProd: ShoppingCart){
    let productCart = this.currentProductsCart.value;
    let prodIdnx = productCart.findIndex(prod => prod.item.name === currentProd.item.name);
    let newCart;
    if(prodIdnx > -1){
      console.log("hola")
      newCart = productCart.filter(pd => pd.item !== productCart[prodIdnx].item)
      console.log(newCart)
    }
    this.currentProductsCart.next(newCart);
  }
}