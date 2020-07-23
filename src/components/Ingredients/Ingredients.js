import React, { useState } from "react";

import IngredientForm from "./IngredientForm";
import Search from "./Search";
import IngredientList from "./IngredientList";
function Ingredients() {
  const [userIngredients, setUserIngredients] = useState([]);

  const addIngredientsHandler = (Ingredients) => {
    fetch("https://rect-hook-update.firebaseio.com/ingredients.json", {
      method: "post",
      body: JSON.stringify(Ingredients),
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => {
        return response.json();
      })
      .then((responseData) => {
        setUserIngredients((prevIngredients) => [
          ...prevIngredients,
          { id: responseData.name, ...Ingredients },
        ]);
      });
  };

  const removeIngredientsHandler = (ingredientId) => {
    setUserIngredients((prevIngredients) =>
      prevIngredients.filter((ingredient) => ingredient.id !== ingredientId)
    );
  };
  return (
    <div className="App">
      <IngredientForm onAddIngredients={addIngredientsHandler} />

      <section>
        <Search />
        <IngredientList
          ingredients={userIngredients}
          onRemoveItem={removeIngredientsHandler}
        ></IngredientList>
      </section>
    </div>
  );
}

export default Ingredients;
