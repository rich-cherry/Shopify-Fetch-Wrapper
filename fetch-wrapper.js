// Upcharge Script
class UpCharge {
  constructor() {
    //Sample Useage
    this.containsUpcharge = false;
    this.containsCustomText = false;
    this.containsCustomImage = false;
    this.currentTotalUpcharges = 0;
    this.totalCorrectUpcharges = 0;
    this.upchargeVariantId = 40348491710655;
  }

  async getCart() {
    try {
      const response = await fetch("/cart.js");
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error: ${error}`)
    }
  }

  //Sample Useage
  async evaluateCart() {
    const data = await this.getCart();
    console.log(data)
    data.items?.forEach(item => {
      if (item.properties?.['Add Personalized Text'] === 'Yes') {
        this.containsCustomText = true;
        this.totalCorrectUpcharges += item.quantity;
      }
      if (item.properties?.['Add a Graphic'] === 'Yes') {
        this.containsCustomImage = true;
        this.totalCorrectUpcharges += item.quantity;
      }
      if (item.variant_id === this.upchargeVariantId) {
        this.containsUpcharge = true;
        this.currentTotalUpcharges = item.quantity;
      }
    })

    console.log(this)

    if (this.containsUpcharge && this.currentTotalUpcharges !== this.totalCorrectUpcharges) {
      let textBody = {
        updates: {
          40348491710655: this.totalCorrectUpcharges
        }
      }
      this.post('/cart/update.js', textBody)
    }
    if (!this.containsUpcharge && this.currentTotalUpcharges !== this.totalCorrectUpcharges) {
      let textBody = {
        items: [
          {
            id: 40348491710655,
            quantity: this.totalCorrectUpcharges
          }
        ]
      }
      this.post('/cart/add.js', textBody)
    }

  }

  post(endpoint, body) {
    return this._send("post", endpoint, body);
  }

  _send(method, endpoint, body) {
    return fetch(endpoint, {
      method,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    })
      .then(response => {
        response.json();
        location.reload();
      }
      )
      .catch((error) => console.error('Error:', error))
  }
}

//Sample Useage
const userCart = new UpCharge;
userCart.evaluateCart();
