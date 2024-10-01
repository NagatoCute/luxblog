---
title: '我的fabric-mc1.21学习记录 1'
description: '开发 1'
---

> 假如未注明，一般是在`main`里面写代码
## 添加我的第一个物品
### 注册物品
 添加目录和文件： `src/main/java/com/example/item/ModItems.java`
```java
//物品注册等
package com.example.item;

import com.example.item.custom.Prospector;
import net.fabricmc.fabric.api.itemgroup.v1.FabricItemGroup;
import net.fabricmc.fabric.api.itemgroup.v1.FabricItemGroupEntries;
import net.fabricmc.fabric.api.itemgroup.v1.ItemGroupEvents;
import net.minecraft.item.Item;
import net.minecraft.item.ItemGroup;
import net.minecraft.item.ItemGroups;
import net.minecraft.registry.Registries;
import net.minecraft.registry.Registry;
import net.minecraft.util.Identifier;

public class ModItems {
    // 声明物品
    public static final Item ICE_ABC = registerItem("ice_abc", new Item(new Item.Settings()));
    public static final Item FIRE_DEF = registerItem("fire_def", new Item(new Item.Settings()));  // 第二个物品
    // 添加到物品栏
    private static void AddItemsToIG(FabricItemGroupEntries fabricItemGroupEntries) {
        fabricItemGroupEntries.add(ICE_ABC);
        fabricItemGroupEntries.add(FIRE_DEF);  // 添加第二个物品
    }

    // 注册物品方法
    private static Item registerItem(String id, Item item) {
        return Registry.register(Registries.ITEM, Identifier.of("fc-mod", id), item);  // 确保 MOD_ID 一致
    }

    // 注册所有物品
    public static void registerModItems() {
        System.out.println("正在注册物品...");
        // 注册物品到指定的物品组
        ItemGroupEvents.modifyEntriesEvent(ItemGroups.TOOLS).register(ModItems::AddItemsToIG);//这里是自己建的物品栏组，下面会提到，也可以换成其他的
    }
}
``` 


之后，在 `src/main/java/com/example/Fcmod.java`也就是主文件下面添加
```java
        // 注册自定义物品
        ModItems.registerModItems();
```

完整代码如下：
```java
package com.example;

import com.example.block.ModBlocks;
import com.example.item.ModItemGroup;
import com.example.item.ModItems;
import com.example.mixin.GrassColorsMixin;
import com.example.tags.ModBlockTags;
import net.fabricmc.api.ModInitializer;
import net.fabricmc.fabric.api.registry.FuelRegistry;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class Fcmod implements ModInitializer {
    // 使用统一的 MOD_ID
    public static final String MOD_ID = "fc-mod";  // 确保与其他代码一致

    // 日志记录器，方便调试
    public static final Logger LOGGER = LoggerFactory.getLogger(MOD_ID);

    @Override
    public void onInitialize() {
        // 这个方法在游戏启动时调用
        LOGGER.info("Hello Fabric world!");

        // 注册自定义物品
        ModItems.registerModItems();
    }
}

```
### 添加物品纹理

物品模型：`…/resources/assets/tutorial/models/item/item_name.json`
物品纹理：`…/resources/assets/tutorial/textures/item/item_name.png`

一个简单的物品模型长这样：
```json
{
  "parent": "item/generated",
  "textures": {
    "layer0": ":item/item_name"
  }
}
```
示例物品纹理可以使用 
[这个链接](https://i.imgur.com/CqLSMEQ.png)



## 添加物品栏(类)
新建目录和文件：`src/main/java/com/example/item/ModItemGroup.java`

```java
package com.example.item;

import com.example.Fcmod;
import com.example.block.ModBlocks;
import net.fabricmc.fabric.api.itemgroup.v1.FabricItemGroup;
import net.minecraft.block.Blocks;
import net.minecraft.item.ItemGroup;
import net.minecraft.item.ItemStack;
import net.minecraft.item.Items;
import net.minecraft.registry.Registries;
import net.minecraft.registry.Registry;
import net.minecraft.text.Text;
import net.minecraft.util.Identifier;

public class ModItemGroup {


    public static final ItemGroup FC_GROUP = Registry.register(Registries.ITEM_GROUP,
            Identifier.of(Fcmod.MOD_ID,"fc_group"),
            FabricItemGroup.builder().displayName(Text.translatable("itemGroup.fc_group"))
                    .icon(()-> new ItemStack(ModItems.ICE_ABC)).entries((displayContext, entries) -> {//图标
                        entries.add(ModItems.ICE_ABC);
                        entries.add(Items.BOOK);
                        entries.add(Blocks.STONE);
                    }).build());
    public static void registerItemGroup() {

    }
}
```

之后同样在 `src/main/java/com/example/Fcmod.java`也就是主文件下面添加
```java
		//注册自定义物品栏
		ModItemGroup.registerItemGroup();
```