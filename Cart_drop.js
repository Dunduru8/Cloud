var $cart = $("#empty_Cart");
var $catalog = $("#goods");
var $navigation = $("#navigation");

function buildCatalog() {
  var shopParams = getShopParams();

  var url = "http://localhost:3000/goods?category=men&_limit=9";

  if(shopParams.category) {
    url += "?category=" + shopParams.category;
    }

 $.ajax({
    url: url,
    dataType: "json",
          success: function(goods) {
            var $goods = $("#goods");
            for(var i = 0; i < goods.length; i++) {
              
              var $src =  goods[i].img
              var $img = $("<img/>").attr({
                src:  $src,
                alt: "featured_items"
               }) 
               var $a = $("<a/>").addClass("items_list").attr("href", "Singl.html");
               $a.append($img);
               var $h2 = $("<h/2>").addClass("items_list_text").text(goods[i].Name);
               var $p = $("<p/>").addClass("items_list_price").text(goods[i].Price);
               var $buttonAddToCart = $("<div/>").addClass("add_tocard");
               var $addToCard = $("<a/>").attr("href", "#").text("Add to card");
               $buttonAddToCart.append($addToCard).data(goods[i]);
               var $div = $("<div/>").addClass("featured_items_box");
              
              $div.append($a);
              $div.append($h2);
              $div.append($p);
              $div.append($buttonAddToCart);
              $goods.append($div);
              
        
            }
          }
        });
};

function buildCart() {
  $("#empty_Cart").empty();
  $.ajax({
    url: "http://localhost:3000/cart",
    dataType: "json",
    success: function(goods) {
      var sum = 0;
      
      goods.forEach(function(item) {
        var $itemInCart = $("<div/>").addClass("item_in_cart");
        var $aImg = $("<img/>").attr({
          src:  item.thumb,
          alt: "item_in_cart"
         }) ;
        $itemInCart.append($aImg);
          var $about_item = $("<div/>").addClass("about_item");
             var $h3 = $("<h3/>").addClass("name_item").text(item.Name)
             var $rewie = $("<div/>").addClass("stars");
             var $aRewie = $("<a/>").attr("href", "#")
                var $imgRewie = $("<img/>").attr({
                    src:  "https://student-geekbrains.000webhostapp.com/img/stars.jpg",
                    alt: "stars"
                    });
                $aRewie.append($imgRewie);
          $rewie.append($aRewie)
          var $price =  $("<div/>", {
            id: "cart-" + item.id
          }).addClass("item_price_cart").text(item.quantity + " x " + item.Price).data(item);
          sum += +item.Price * +item.quantity; 
          
          var $divDel = $("<div/>").addClass("delit_items").data(item);
          var $aDel =  $("<a/>").attr("href", "#");
          var $imgDel = $("<img/>").attr({
            src:  "https://student-geekbrains.000webhostapp.com/img/del.png",
            alt: "del",
            class: "del_item"
           }).data(item);
        
         $aDel.append($imgDel);
         $divDel.append($aDel);

         $about_item.append($h3);
         $about_item.append($rewie);
         $about_item.append($price);
         $itemInCart.append($about_item);
         $itemInCart.append($divDel);
         $("#empty_Cart").append($itemInCart);

        });
      $("#total_price").text("$" + sum);
    }
  });
}


(function($) {
  buildCatalog();
  buildCart();
  
  $navigation.on("click", ".menu_link", function(event){
    
    buildCatalog();
    event.preventDefault();

  });

  $cart.on("click", ".delit_items", function() {
    var good = $(this).data();
    if(good.quantity > 1){
      $.ajax({
        url: "http://localhost:3000/cart/" + good.id,
        type: "PATCH",
        dataType: "json",
        data: { quantity: good.quantity - 1 },
        success: function() {
          buildCart();
        }
      });
    }else{
    $.ajax({
      url: "http://localhost:3000/cart/" + good.id,
      type: "DELETE",
      success: function() {
        buildCart();
      }
    });
  }
  });

  $catalog.on("click", ".add_tocard ", function() {
    var good = $(this).data();
    if($("#cart-" + good.id).length) {
      // товар в корзине есть - нужно увеличить количество
      var goodInCart = $("#cart-" + good.id).data();
      $.ajax({
        url: "http://localhost:3000/cart/" + good.id,
        type: "PATCH",
        dataType: "json",
        data: { quantity: +goodInCart.quantity + 1 },
        success: function() {
          buildCart();
        }
      });
    } else {
      // товара в корзине нет - нужно добавить
      good.quantity = 1;
      $.ajax({
        url: "http://localhost:3000/cart",
        type: "POST",
        dataType: "json",
        data: good,
        success: function() {
          buildCart();
        }
      });
    }
});
})(jQuery);

