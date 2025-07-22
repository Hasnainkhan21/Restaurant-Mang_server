const Menu = require('../Models/Menue')
const Inventory = require('../Models/Inventory')


exports.itemProfit = async (req, res) =>{
    try{
        //get all iems
        const menuItems = await Menu.find().populate('ingredients.inventoryId');

        //go through each menuitem 
        const profitList =  menuItems.map((menu)=>{
            let totalExpense = 0;

            //now go through each ingrediant of itam
            menu.ingredients.forEach((ingrediant) =>{
                const inventory = ingrediant.inventoryId;
                const quantityNeed = ingrediant.quantity;

                if(inventory && inventory.unitPrice != null){
                    const cost = quantityNeed * inventory.unitPrice;
                    totalExpense = totalExpense + cost
                }
            })

            const profit = menu.price - totalExpense

            return{
                menuId : menu._id,
                menuName: menu.name,
                price : menu.price,
                totalExpense: parseFloat(totalExpense.toFixed(2)),
                profit : parseFloat(profit.toFixed(2))
            }
        })
        res.json(profitList)
    }catch(error){
        console.log(error);
    }
}