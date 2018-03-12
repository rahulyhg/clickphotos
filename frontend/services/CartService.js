firstapp.service('CartService', function ($http) {
    this.myFunc = function (x) {
        console.log("###########in cartSErvice");
        return x.toString(16);
    }
})