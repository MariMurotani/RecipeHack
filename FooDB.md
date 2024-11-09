### FooDB MEMO

1. Find Food Group

mysql> select food_group from foods where food_group is not null group by food_group;

+-----------------------------+
| food_group                  |
+-----------------------------+
| Herbs and Spices            |
| Vegetables                  |
| Fruits                      |
| Nuts                        |
| Cereals and cereal products |
| Pulses                      |
| Teas                        |
| Gourds                      |
| Coffee and coffee products  |
| Soy                         |
| Cocoa and cocoa products    |
| Beverages                   |
| Aquatic foods               |
| Animal foods                |
| Milk and milk products      |
| Eggs                        |
| Confectioneries             |
| Baking goods                |
| Dishes                      |
| Snack foods                 |
| Baby foods                  |
| Unclassified                |
| Fats and oils               |
+-----------------------------+
23 rows in set (0.00 sec)


2. Find Food SubGroup
mysql> select food_subgroup from foods where food_subgroup is not null and food_subgroup != "" group by food_subgroup;
+-----------------------------+
| food_subgroup               |
+-----------------------------+
| Herbs                       |
| Cabbages                    |
| Tropical fruits             |
| Onion-family vegetables     |
| Nuts                        |
| Spices                      |
| Root vegetables             |
| Shoot vegetables            |
| Cereals                     |
| Leaf vegetables             |
| Oilseed crops               |
| Peas                        |
| Teas                        |
| Fruit vegetables            |
| Gourds                      |
| Citrus                      |
| Coffee                      |
| Pomes                       |
| Berries                     |
| Other fruits                |
| Soy                         |
| Tubers                      |
| Lentils                     |
| Other pulses                |
| Beans                       |
| Drupes                      |
| Stalk vegetables            |
| Cocoa                       |
| Fermented beverages         |
| Other breads                |
| Cereal products             |
| Soy products                |
| Doughs                      |
| Distilled beverages         |
| Fortified wines             |
| Alcoholic beverages         |
| Mollusks                    |
| Seaweed                     |
| Crustaceans                 |
| Fishes                      |
| Cetaceans                   |
| Bovines                     |
| Swine                       |
| Other seeds                 |
| Other vegetables            |
| Poultry                     |
| Venison                     |
| Equines                     |
| Other aquatic foods         |
| Pinnipeds                   |
| Lagomorphs                  |
| Ovis                        |
| Caprae                      |
| Mushrooms                   |
| Amphibians                  |
| Fermented milk products     |
| Unfermented milks           |
| Eggs                        |
| Frozen desserts             |
| Other confectioneries       |
| Candies                     |
| Seasonings                  |
| Desserts                    |
| Other dishes                |
| Snack foods                 |
| Flat breads                 |
| Dressings                   |
| Sauces                      |
| Other milk products         |
| Substitutes                 |
| Sugars                      |
| Ground meat                 |
| Condiments                  |
| Baking goods                |
| Fruit products              |
| Waters                      |
| Fish products               |
| Other beverages             |
| Baby foods                  |
| Vegetable products          |
| Unclassified                |
| Animal fats                 |
| Spreads                     |
| Herb and spice mixtures     |
| Cocoa products              |
| Fermented milks             |
| Leavened breads             |
| Roe                         |
| Nutritional beverages       |
| Tex-Mex cuisine             |
| Sandwiches                  |
| Milk desserts               |
| Asian cuisine               |
| Herbal teas                 |
| Pasta dishes                |
| Berber cuisine              |
| Coffee products             |
| Mexican cuisine             |
| Potato dishes               |
| American cuisine            |
| Wrappers                    |
| Vegetable fats              |
| Latin American cuisine      |
| Bread products              |
| Sweet breads                |
| Jewish cuisine              |
| Levantine cuisine           |
| Brassicas                   |
| Cereals and cereal products |
| Cocoa and cocoa products    |
| Coffee and coffee products  |
| Milk and milk products      |
| Fats and oils               |
| Herbs and Spices            |
| Pulses                      |
| Beverages                   |
| Fruits                      |
| Green vegetables            |
| Bivalvia                    |
+-----------------------------+
119 rows in set (0.00 sec)

3. Find preparation type
mysql> select preparation_type from contents where preparation_type is not NULL and preparation_type != 'No' group by preparation_type;
+---------------------------------------------------+
| preparation_type                                  |
+---------------------------------------------------+
| raw                                               |
| other                                             |
| other (raw)                                       |
| tea or coffee                                     |
| cooked                                            |
| raw, frozen                                       |
| dried or powder                                   |
| other (raw, frozen)                               |
| beverage (frozen concentrated)                    |
| oil                                               |
| beverage (juice)                                  |
| beverage (frozen)                                 |
| other (beverage)                                  |
| beverage (juice, concentrated)                    |
| puree                                             |
| other (dried or powder)                           |
| beverage (Alcoholic)                              |
| No                                                |
| dairy product                                     |
| cooked or raw                                     |
| beverage (juice, added ascorbic acid)             |
| beverage (juice, added ascorbic acid and calcium) |
| beverage (ascorbic acid added)                    |
| raw, frozed                                       |
| blanching water                                   |
| raw, dried                                        |
| raw, frozen, dried                                |
+---------------------------------------------------+
27 rows in set (1.39 sec)

4. Find content subtypes of related apple
mysql> select orig_food_common_name from contents where food_id = 105 group by orig_food_common_name;

+-------------------------------------------------------------------------------------------------------+
| orig_food_common_name                                                                                 |
+-------------------------------------------------------------------------------------------------------+
| Apple                                                                                                 |
| Apple jelly                                                                                           |
| Apple juice, canned or bottled                                                                        |
| Apple, danish, raw                                                                                    |
| Apple, dried                                                                                          |
| Apple, imported, raw                                                                                  |
| Apple, raw, all varieties                                                                             |
| Apples, raw, with skin                                                                                |
| Apples, raw, without skin                                                                             |
........


5. Fetch Molecules amount contained 
select id, orig_food_common_name, orig_source_id,  standard_content, orig_unit from contents where citation_type ='DATABASE' and source_type = 'Compound' and standard_content > 0.0 and food_id=105 and orig_food_common_name ='Apple' order by standard_content desc limit 20;

* or you just use orig_food_common_name ='Apple' for filter

5. Find molecules in specific foods

 SELECT foods.id,orig_food_common_name,
 contents.orig_source_name, contents.standard_content, contents.orig_unit, compounds.id as compound_id,
 flavors.id, flavors.name
 FROM 
 foods INNER JOIN contents ON foods.id = contents.food_id
 INNER JOIN compounds ON contents.source_id = compounds.id 
 LEFT JOIN compounds_flavors on compounds.id = compounds_flavors.compound_id
 LEFT JOIN flavors on compounds_flavors.flavor_id = flavors.id
  where contents.citation_type ='DATABASE' and contents.source_type = 'Compound' and contents.standard_content > 0.0 and contents.food_id=105 
  and orig_food_common_name ='Apple' and flavors.name is not null
   order by contents.standard_content desc limit 30;
   
