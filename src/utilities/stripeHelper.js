
const sk = 'sk_test_51K0ITNSBgCgnRGDibxLvi9JtNFfoiqGh3JEtMS3T1yZVckyYGfchc6jhPvKznuPgR2AIpPnnGxUm4S1gg2xIHk9S0063wcjv6p'
const pk = 'pk_test_51K0ITNSBgCgnRGDi7rYhje3jQzPXeebDWIiVKGfqWXiq1SvstBmGYXxVv5Zr5lTheH98qr60CM0N8fhfwrzIVKdz00MAWgga5G'
const stripe = require('stripe')(sk);


module.exports = {
    createPayment: (obj) => {
        console.log("data",obj);
        return new Promise((resolve, reject) => {
            stripe.customers.create({
                email: obj.stripeEmail,
                source: obj.stripeToken,
                name: obj.name,
                address: {
                    line1: obj.address,
                    postal_code: obj.pincide,
                    city: obj.city,
                    state: obj.state,
                    country: obj.country,
                }
            })
                .then((customer) => {

                    return stripe.charges.create({
                        amount: obj.amount,
                        description: obj.description,
                        currency: 'INR',
                        customer: customer.id
                    });
                })
                .then((charge) => {
                    resolve(charge)
                })
                .catch((err) => {
                    reject(err)
                });
        })
    },
    paymentTemplate:(req,res)=>{
        let h=`<!DOCTYPE html>
        <html>
        <title>Stripe Payment Demo</title>
        <body>
            <h3>Welcome to Payment Gateway</h3>
            <form action="payment" method="POST">
               <script 
                  src="//checkout.stripe.com/v2/checkout.js"
                  class="stripe-button"
                  data-key="${pk}"
                  data-amount="2500"
                  data-currency="inr"
                  data-name="Crafty Gourav"
                  data-description="Handmade Art and Craft Products"
                  data-locale="auto" >
                </script>
            </form>
        </body>
        </html>`

        res.render(h)
    }
}