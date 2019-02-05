import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import PropTypes from 'prop-types';
import firebase from "firebase";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";

firebase.initializeApp({
  apiKey: "AIzaSyARTgcYyzgmzGnZ3GsD4ibvsW_sustI894",
  authDomain: "react-shopping-cart-8cf88.firebaseapp.com",
  databaseURL: "https://react-shopping-cart-8cf88.firebaseio.com/",
  projectId: "react-shopping-cart-8cf88"
})

class ProductInformation extends React.Component {
  render() {
    const product = this.props.product;
    return (
      <div class="Product-information">
        <div class="Product-title">{product.title}</div>
        <div class="Product-price">${product.price}</div>
      </div>
    );
  }
}

class AddToCartButton extends React.Component {
  addToCart(event) {
    var selectedSize = "";
    var available = false;
    for (var i = 0; i < this.props.product.availableSizes.length; i++){
      var cur = this.props.product.availableSizes[i];
      if(document.getElementById(this.props.product.title + cur).checked) selectedSize = cur;
    }
    
    this.props.callback(this.props.product.title, selectedSize);
  }

  render() {
    const sizes = this.props.product.availableSizes;
    const sizeGallery = [];
    for(var i = 0; i < sizes.length; i++){
      var size = sizes[i];
      if(this.props.catalog && this.props.catalog[size] && this.props.catalog[size] > 0){
        sizeGallery.push(
          <label class="radio-inline available">
            <input type="radio" name="optradio" id={this.props.product.title + size} checked/>{size}
          </label>
        );
      } else {
        sizeGallery.push(
          <label class="radio-inline unavailable">
            <input type="radio" name="optradio" id={this.props.product.title + size} checked/>{size}
          </label>
        );
      }
    }

    return (
      <div>
        <form>
          {sizeGallery}
        </form>
        <button class="Button" onClick={this.addToCart.bind(this)}>Add to Cart</button>
      </div>
    );
  }
}

class ProductCard extends React.Component {
  render() {
    const product = this.props.product;
    return (
      <div class="Product-card">
        <img class="Product-image" src={require(`./static/products/${product.sku}_1.jpg`)}/>
        <ProductInformation product={this.props.product}/>
        <AddToCartButton callback={this.props.callback} product={this.props.product} catalog={this.props.catalog}/>
      </div>
    );
  }
}

class CartItem extends React.Component {
  removeFromCart(event) {
    this.props.callback(this.props.title, this.props.size);
  }

  render() {
    return (
      <div>
        <button class="Button" onClick={this.removeFromCart.bind(this)}>-</button>
        {" " + this.props.size + " " + this.props.title + ": " + this.props.count}
      </div>
    );
  }
}

class Cart extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  state = {
    cartIsOpen: false,
  };

  handleClick = (event) => {   
    this.setState({
      cartIsOpen: this.state.cartIsOpen ? false : true
    });
  };

  checkout = (event) => {
    this.props.checkout();
  }

  render() {
    const cartContents = this.props.cartContents;
    var callback = this.props.callback;
    var items = [];
    Object.keys(cartContents).forEach(function(product) {
      Object.keys(cartContents[product]).forEach(function(size){
        if(cartContents[product][size] > 0) {
          items.push(<CartItem callback={callback} title={product} size={size} count={cartContents[product][size]}/>);
        }
      });
    });

    return (
      <div class={(this.state.cartIsOpen ? 'Cart-open Hover' : 'Cart-closed Hover')}>
        <img class="Cart-image" src={require(`./static/bag-icon.png`)} onClick={() => this.handleClick()}/>
        <span class="Cart-count">{this.props.productsInCart}</span>
        <div class={(this.state.cartIsOpen ? 'Visible' : 'Hidden')}>{items}</div>
        <button class={(this.state.cartIsOpen ? 'Visible Button' : 'Hidden')} onClick={this.checkout.bind(this)} >Checkout</button>
      </div>
    );
  }
}


class ProductTable extends Component {
  render() {
    function validSizes(product, sizes) {
      for(var i = 0; i < product.availableSizes.length; i++){
        if(sizes[product.availableSizes[i]] == 1) {
          return true;
        }
      }
      return false;
    }
    const products = this.props.products;
    var gallery;
    var sizesSelected = 0;
    const selectedSizes = this.props.selectedSizes;
    Object.keys(selectedSizes).forEach(function(size){
      sizesSelected += selectedSizes[size];
    });
    if(products && sizesSelected > 0) {
      gallery = products.filter(product => (
        validSizes(product, selectedSizes)
      )).map(product => (
        <ProductCard callback={this.props.callback} product={product} catalog={this.props.catalog[product.title] ? this.props.catalog[product.title] : null}/>
      ));
    } else if(products){
      gallery = products.map(product => (
        <ProductCard callback={this.props.callback} product={product} catalog={this.props.catalog[product.title] ? this.props.catalog[product.title] : null}/>
      ));
    } else {
      gallery = (<div>No Data</div>);
    }
    
    
    return(
      <div class="Product-table">{gallery}</div>
    )
  }
}


class SizeOption extends Component {
  toggleSize(event) {
    this.props.callback(this.props.size);
  }

  render() {
    var css;
    if(this.props.selected == 1){
      css = "size-selected";
    } else {
      css =  "size";
    }
    return (
      <div class={css} onClick={this.toggleSize.bind(this)}>
        {this.props.size}
      </div>
    );
  }
}

class SizeOptions extends Component {

  render() {
    var sizes = [];
    const selectedSizes = this.props.selectedSizes;
    var callback = this.props.callback
    Object.keys(selectedSizes).forEach(function(size){
      sizes.push(<SizeOption callback={callback} size={size} selected={selectedSizes[size]} />);
    });
    return(
    <div class="sizes">
      {sizes}
    </div>
    )
  }
}

class App extends Component {
  constructor(props) 
  {
    super(props)
    this.state = {
      isSignedIn: false,
      productList: null,
      productsInCart: 0,
      cartContents: {},
      catalog: {},
      selectedSizes: {
        "XS": 0,
        "S": 0,
        "M": 0,
        "ML": 0,
        "L": 0,
        "XL": 0,
        "XXL": 0,
      },
      user: null
    }
  }

  addToCart(productName, size) {
    if(this.state.catalog[productName] && this.state.catalog[productName][size]){
      if(this.state.cartContents[productName] && this.state.cartContents[productName][size]){
        var reserved = this.state.cartContents[productName][size];
        if(this.state.catalog[productName][size] - this.state.cartContents[productName][size] > 0){
          var dict = this.state.cartContents;
          const productEntry = {};
          productEntry[size] = 1;
          if(dict[productName]){
            dict[productName][size] ? dict[productName][size] += 1 : dict[productName][size] = 1;
          } else {
            dict[productName] = productEntry;
          }
          this.setState({
            productsInCart: this.state.productsInCart + 1,
            cartContents: dict
          });
          firebase.database().ref('CartItems/' + this.state.user.uid + '/' + productName + '/' + size + '/').set({
            count: dict[productName][size]
          });
        } else {
          alert("You have already added all available items of this size to your cart.")
        }
      } else {
        var dict = this.state.cartContents;
        const productEntry = {};
        productEntry[size] = 1;
        if(dict[productName]){
          dict[productName][size] ? dict[productName][size] += 1 : dict[productName][size] = 1;
        } else {
          dict[productName] = productEntry;
        }
        this.setState({
          productsInCart: this.state.productsInCart + 1,
          cartContents: dict
        });
        firebase.database().ref('CartItems/' + this.state.user.uid + '/' + productName + '/' + size + '/').set({
          count: dict[productName][size]
        });
      }
      
    } else {
      alert("Size not available.");
    }
  };

  removeFromCart(productName, size) {
    var dict = this.state.cartContents;
    dict[productName][size] -= 1;
    this.setState({
      productsInCart: this.state.productsInCart - 1,
      cartContents: dict
    });
    if(dict[productName][size] > 0){
      firebase.database().ref('CartItems/' + this.state.user.uid + '/' + productName + '/' + size + '/').set({
        count: dict[productName][size]
      });
    } else {
      firebase.database().ref('CartItems/' + this.state.user.uid + '/' + productName + '/' + size + '/').remove();
    }
  };

  checkout() {
    const catalog = {}
    firebase.database().ref('Catalog/').once('value', function (snapshot) {
      if(snapshot.val()){
        Object.keys(snapshot.val()).forEach(function(product) {
          const productCatalog = {};
          Object.keys(snapshot.val()[product]).forEach(function(size){
            productCatalog[size] = snapshot.val()[product][size]["Count"];
          });
          catalog[product] = productCatalog;
        });
      }
    }).then(data => {
      this.setState({catalog: catalog});
      const cartContents = this.state.cartContents;
      Object.keys(cartContents).forEach(function(product) {
        Object.keys(cartContents[product]).forEach(function(size){
          var desired = cartContents[product][size];
          var available = catalog[product] && catalog[product][size] ? catalog[product][size] : 0;
          if(desired == 0){
          } else if(available == 0) {
            alert(size + " " + product + " is no longer available but the rest of your order will be processed.");
          } else if(desired > available){
            alert("Only " + available + " " + size + " " + product + " are available so your order has been updated.");
            if(available > 0){
              firebase.database().ref('Catalog/' + product + '/' + size + '/').remove();
              catalog[product][size] = 0;
            }
          } else if(desired == available) {
            firebase.database().ref('Catalog/' + product + '/' + size + '/').remove();
            catalog[product][size] = 0;
          } else {
            firebase.database().ref('Catalog/' + product + '/' + size + '/').set({
              Count: available - desired
            });
            catalog[product][size] = available - desired;
          }
        });
      });
      this.setState({cartContents: {}, productsInCart: 0, catalog: catalog});
      firebase.database().ref('CartItems/' + this.state.user.uid + '/').remove();
    });
  };

  toggleSize(size) {
    var sizes = this.state.selectedSizes;
    if(sizes[size] == 1){
      sizes[size] = 0;
    } else {
      sizes[size] = 1;
    }
    this.setState({
      selectedSizes: sizes
    })
  };

  componentDidMount() {
    import("./products.json")
    .then(json => this.setState({productList: json.default.products}));
    
    firebase.auth().onAuthStateChanged(user => {
      this.setState({isSignedIn:!!user, user:user});

      const cart = {}
      var count = 0;
      if(this.state.user) {  
        firebase.database().ref('CartItems/' + this.state.user.uid + '/').once('value', function (snapshot) {
          if(snapshot.val()){
            Object.keys(snapshot.val()).forEach(function(product) {
              const productCart = {};
              Object.keys(snapshot.val()[product]).forEach(function(size){
                productCart[size] = snapshot.val()[product][size]["count"];
                count += snapshot.val()[product][size]["count"];
              });
              cart[product] = productCart;
            });
          }
        }).then(data => {
          this.setState({cartContents: cart, productsInCart: count});
        });
      }

      const catalog = {}
      firebase.database().ref('Catalog/').once('value', function (snapshot) {
        if(snapshot.val()){
          Object.keys(snapshot.val()).forEach(function(product) {
            const productCatalog = {};
            Object.keys(snapshot.val()[product]).forEach(function(size){
              productCatalog[size] = snapshot.val()[product][size]["Count"];
            });
            catalog[product] = productCatalog;
          });
        }
      }).then(data => {
        this.setState({catalog: catalog});
      });

    });
  }

  uiConfig = {
    signInFlow: "popup",
    signInOptions: [
      firebase.auth.GoogleAuthProvider.PROVIDER_ID
    ],
    callbacks: {
      signInSuccessWithAuthResult: () => false
    }
  }

  render() {
    let my_json = {}
    
    if(this.state.isSignedIn){
      return (
        <div class="App-area">
          <SizeOptions callback={this.toggleSize.bind(this)} selectedSizes={this.state.selectedSizes}/>
          <ProductTable products={this.state.productList} callback={this.addToCart.bind(this)} selectedSizes={this.state.selectedSizes} catalog={this.state.catalog}/>
          <Cart productsInCart={this.state.productsInCart} cartContents={this.state.cartContents} callback={this.removeFromCart.bind(this)} checkout={this.checkout.bind(this)} products={this.state.productList}/>
          <button class="sign-out" onClick={()=>firebase.auth().signOut()}>Sign out!</button>
        </div>
      );
    } else {
      return (
        <StyledFirebaseAuth uiConfig={this.uiConfig} firebaseAuth={firebase.auth()}/>
      )
    }
  }
}

export default App;
