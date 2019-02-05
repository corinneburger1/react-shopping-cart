import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import PropTypes from 'prop-types';

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
    for (var i = 0; i < this.props.product.availableSizes.length; i++){
      var cur = this.props.product.availableSizes[i];
      if(document.getElementById(this.props.product.title + cur).checked) selectedSize = cur;
    }
    this.props.callback(this.props.product.title, selectedSize);
  }

  render() {
    const sizes = this.props.product.availableSizes;
    const sizeGallery = sizes ? sizes.map(size => (
        <label class="radio-inline">
          <input type="radio" name="optradio" id={this.props.product.title + size} checked/>{size}
        </label>
    )) : (<div>No Data</div>);

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
        <AddToCartButton callback={this.props.callback} product={this.props.product} />
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
        {this.props.size + " " + this.props.title + ': ' + this.props.count}
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
        <button class={(this.state.cartIsOpen ? 'Visible Button' : 'Hidden')}>Checkout</button>
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
        <ProductCard callback={this.props.callback} product={product}/>
      ));
    } else if(products){
      gallery = products.map(product => (
        <ProductCard callback={this.props.callback} product={product}/>
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
    console.log("clicked");
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
      productList: null,
      productsInCart: 0,
      cartContents: {},
      selectedSizes: {
        "XS": 0,
        "S": 0,
        "M": 0,
        "ML": 0,
        "L": 0,
        "XL": 0,
        "XXL": 0,
      }
    }
  }

  addToCart(productName, size) {
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
  };

  removeFromCart(productName, size) {
    var dict = this.state.cartContents;
    dict[productName][size] -= 1;
    this.setState({
      productsInCart: this.state.productsInCart - 1,
      cartContents: dict
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
  }

  render() {
    let my_json = {}

    return (
      <div class="App-area">
        <SizeOptions callback={this.toggleSize.bind(this)} selectedSizes={this.state.selectedSizes}/>
        <ProductTable products={this.state.productList} callback={this.addToCart.bind(this)} selectedSizes={this.state.selectedSizes}/>
        <Cart productsInCart={this.state.productsInCart} cartContents={this.state.cartContents} callback={this.removeFromCart.bind(this)} products={this.state.productList}/>
      </div>
    );
  }
}

export default App;
