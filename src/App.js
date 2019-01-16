import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

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

class ProductCard extends React.Component {
  render() {
    const product = this.props.product;
    return (
      <div class="Product-card">
        <img class="Product-image" src={require(`./static/products/${product.sku}_1.jpg`)}/>
        <ProductInformation product={this.props.product}/>
      </div>
    );
  }
}

class ProductTable extends Component {
  render() {
    const products = this.props.products;
    const gallery = products ? products.map(product => (
      <ProductCard product={product}/>
    )) : (<div>No Data</div>);
    console.log(gallery);
    return(
      <ul>{gallery}</ul>
    )
  }
}

class App extends Component {

  constructor(props) 
  {
    super(props)
    this.state = {
      productList: null
    }
  }

  componentDidMount() {
    import("./products.json")
    .then(json => this.setState({productList: json.default.products}))
  }

  render() {
    let my_json = {}

    return (
      <div>
        <ProductTable products={this.state.productList} />
      </div>
    );
  }

}


export default App;
