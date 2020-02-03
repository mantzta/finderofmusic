var shoppingcart = [];

$(document).ready(function(){
    updateCart();
    
    $('#section-shop button').click(function(){
        var product = $(this).data('shop-listing');
        checkProduct(product);
    }); 
    
    $('#shoppingcart-form tbody').on('click', 'button:contains("Remove")', function() {
        var name = $(this).closest('tr').find('h3').html();
        var description = $(this).closest('tr').find('p').html();
        removeFromCart(name, description);
        $(this).closest('tr').remove();
    }); 
    
    $('#shoppingcart-form tbody').on('click', 'button:contains("-")', function() {
        var number = $(this).closest('td').find('input').val();
        var name = $(this).closest('tr').find('h3').html();
        var description = $(this).closest('tr').find('p').html();
        if(number == 1){
            removeFromCart(name, description);
            $(this).closest('tr').remove();
        }else{
            number = parseInt(number);
            number -= 1;
            changeNumber(name, description, number);
        }
    }); 
    
    $('#shoppingcart-form tbody').on('click', 'button:contains("+")', function() {
        var number = $(this).closest('td').find('input').val();
        number = parseInt(number);
        number += 1;
        var name = $(this).closest('tr').find('h3').html();
        var description = $(this).closest('tr').find('p').html();
        changeNumber(name, description, number);
    });
    
    $('#shoppingcart-form tbody').on('keyup mouseup', 'input', function() {
        var number = $(this).val();
        number = parseInt(number);
        var name = $(this).closest('tr').find('h3').html();
        var description = $(this).closest('tr').find('p').html();
        changeNumber(name, description, number);
    });
    
});

// add new product to cart or increase the number of product type
function updateCart(){
    // hide cart if nothing is in there
    if(shoppingcart.length == 0){
        $('#shoppingcart-form').hide();
        $('#section-shoppingcart > :nth-child(2)').show();
    // add new table row for every product in cart
    }else{
        var total = 0;
        var trToAdd = '<tr><td><h3></h3><p></p><div><button type="button">Remove</button>'+
            '</div></td><td><output></output></td><td>'+
            '<input type="number" min="1" value="1" class="number-products">'+
            '<span><button type="button" aria-label="decrease" class="cart-btn">-</button>'+
            '<button type="button" aria-label="step up" class="cart-btn">+</button>'+
            '</span></td></tr>";'
        $('#shoppingcart-form tbody tr').remove();
        for(var i=0; i<shoppingcart.length; i++){
            total += shoppingcart[i].toPay;
            $('#shoppingcart-form tbody').append(trToAdd);
            var position = i+1;
            var selector = '#shoppingcart-form tbody tr:nth-child('+position+')';
            var selH3 = selector + ' h3';
            var selP = selector + ' p';
            var selOutput = selector + ' output';
            var selInput = selector + ' input';
            $(selH3).html(shoppingcart[i].name);
            $(selP).html(shoppingcart[i].description);
            $(selOutput).html('€' + shoppingcart[i].toPay);
            $(selInput).val(shoppingcart[i].number);
        }
        // calculate price
        total = parseFloat(total.toFixed(2));
        var tax = parseFloat((total*0.2).toFixed(2));
        var totalToBePaid = parseFloat((total+tax).toFixed(2));
        $('tfoot li:nth-child(1) label')
            .html('Price before <abbr title="Value Added Tax">VAT</abbr>: €' + total);
        $('tfoot li:nth-child(2) label')
            .html('<abbr title="Value Added Tax">VAT</abbr> @ <strong></strong>%: €' + tax);
        $('tfoot li:nth-child(3) output').html('€' + totalToBePaid);
        $('#section-shoppingcart > :nth-child(2)').hide();
        $('#shoppingcart-form').show();
    }
}

// checks if product is already in cart
function checkProduct(product){
   if(shoppingcart.length == 0){
       shoppingcart[0] = product;
       shoppingcart[0].toPay = product.price;
       shoppingcart[0].number = 1;
   }else{
       var exists = false;
       for(var i=0; i<shoppingcart.length; i++){
           if(shoppingcart[i].name == product.name &&
              shoppingcart[i].description == product.description){
               // increase number, price if it exists already
               var newPay = shoppingcart[i].toPay + product.price;
               newPay = parseFloat(newPay.toFixed(2));
               shoppingcart[i].toPay = newPay;
               shoppingcart[i].number += 1;
               exists = true;
               break;
           }
       }
       // if it does not exist, add the product
       if(!exists){
           var index = shoppingcart.length;
           shoppingcart[index] = product;
           shoppingcart[index].toPay = product.price;
           shoppingcart[index].number = 1;
       }
   }
   updateCart();
}

// will remove the whole product from cart
function removeFromCart(name, description){
    for(var i=0; i<shoppingcart.length; i++){
        if(shoppingcart[i].name == name &&
           shoppingcart[i].description == description){
               shoppingcart.splice(i, 1);
               break;
        }
    }
    updateCart();
}

// changes amount of product in cart and adapts price
function changeNumber(name, description, number){
    for(var i=0; i<shoppingcart.length; i++){
        if(shoppingcart[i].name == name &&
           shoppingcart[i].description == description){
            var newPay = shoppingcart[i].price*number;
            newPay = parseFloat(newPay.toFixed(2));
            shoppingcart[i].toPay = newPay;
            shoppingcart[i].number = number;
            break;
        }
    }
    updateCart();
}