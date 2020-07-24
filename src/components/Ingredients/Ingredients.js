import React, { useState, useEffect, useCallback } from "react";
import ErrorModal from "../UI/ErrorModal";
import IngredientForm from "./IngredientForm";
import Search from "./Search";
import IngredientList from "./IngredientList";
function Ingredients() {
  const [userIngredients, setUserIngredients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  useEffect(() => {
    fetch("https://rect-hook-update.firebaseio.com/ingredients.json")
      .then((response) => {
        return response.json();
      })
      .then((responseData) => {
        const loadedIngredients = [];
        for (const key in responseData) {
          loadedIngredients.push({
            id: key,
            title: responseData[key].title,
            amount: responseData[key].amount,
          });
        }
        setUserIngredients(loadedIngredients);
      });
  }, []);

  useEffect(() => {
    console.log("INGREDIENTS", userIngredients);
  }, [userIngredients]);
  const addIngredientsHandler = (Ingredients) => {
    setIsLoading(true);
    fetch("https://rect-hook-update.firebaseio.com/ingredients.json", {
      method: "post",
      body: JSON.stringify(Ingredients),
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => {
        setIsLoading(false);
        return response.json();
      })
      .then((responseData) => {
        setUserIngredients((prevIngredients) => [
          ...prevIngredients,
          { id: responseData.name, ...Ingredients },
        ]);
      });
  };

  const filteredIngredientsHandler = useCallback((filteredIngredients) => {
    setUserIngredients(filteredIngredients);
  }, []);
  const removeIngredientsHandler = (ingredientId) => {
    setIsLoading(true);
    fetch(
      `https://rect-hook-update.firebaseio.com/ingredients/${ingredientId}.jsson`,
      {
        method: "DELETE",
      }
    )
      .then((response) => {
        setIsLoading(false);
        setUserIngredients((prevIngredients) =>
          prevIngredients.filter((ingredient) => ingredient.id !== ingredientId)
        );
      })
      .catch((error) => {
        setError("Something went wrong");
        setIsLoading(false);
      });
  };

  const clearError = () => {
    setError(null);
  };
  return (
    <div className="App">
      {error && <ErrorModal onClose={clearError}>{error}</ErrorModal>}
      <IngredientForm
        onAddIngredients={addIngredientsHandler}
        loading={isLoading}
      />

      <section>
        <Search onLoadIngredients={filteredIngredientsHandler} />
        <IngredientList
          ingredients={userIngredients}
          onRemoveItem={removeIngredientsHandler}
        ></IngredientList>
      </section>
    </div>
  );
}

export default Ingredients;
