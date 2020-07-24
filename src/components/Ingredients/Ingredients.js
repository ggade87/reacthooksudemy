import React, { useReducer, useState, useEffect, useCallback } from "react";
import ErrorModal from "../UI/ErrorModal";
import IngredientForm from "./IngredientForm";
import Search from "./Search";
import IngredientList from "./IngredientList";
const ingredientReducer = (currentIngredients, action) => {
  switch (action.type) {
    case "SET":
      return action.ingredients;
    case "ADD":
      return [...currentIngredients, action.ingredient];
    case "DELETE":
      return currentIngredients.filter((ing) => ing.id !== action.id);
    default:
      throw new Error("Should not get there!");
  }
};

const httpReducer = (httpState, action) => {
  switch (action.type) {
    case "SEND":
      return { loading: true, error: null };
    case "RESPONSE":
      return { ...httpState, loading: false };
    case "ERROR":
      return { loading: false, error: action.errorData };
    case "CLEAR":
      return { ...httpState, error: null };
    default:
      throw new Error("Error");
  }
};
function Ingredients() {
  const [userIngredients, dispatch] = useReducer(ingredientReducer, []);
  const [httpState, dispatchHttp] = useReducer(httpReducer, {
    loading: false,
    error: null,
  });
  //const [userIngredients, setUserIngredients] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);
  // const [error, setError] = useState(false);
  useEffect(() => {
    // fetch("https://rect-hook-update.firebaseio.com/ingredients.json")
    //   .then((response) => {
    //     return response.json();
    //   })
    //   .then((responseData) => {
    //     const loadedIngredients = [];
    //     for (const key in responseData) {
    //       loadedIngredients.push({
    //         id: key,
    //         title: responseData[key].title,
    //         amount: responseData[key].amount,
    //       });
    //     }
    //     setUserIngredients(loadedIngredients);
    //   });
  }, []);

  useEffect(() => {
    console.log("INGREDIENTS", userIngredients);
  }, [userIngredients]);

  const filteredIngredientsHandler = useCallback((filteredIngredients) => {
    //setUserIngredients(filteredIngredients);
    dispatch({ type: "SET", ingredients: filteredIngredients });
  }, []);

  const addIngredientsHandler = (Ingredient) => {
    //setIsLoading(true);
    dispatchHttp({ type: "SEND" });
    fetch("https://rect-hook-update.firebaseio.com/ingredients.json", {
      method: "post",
      body: JSON.stringify(Ingredient),
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => {
        dispatchHttp({ type: "RESPONSE" });
        return response.json();
      })
      .then((responseData) => {
        dispatch({
          type: "ADD",
          ingredient: { id: responseData.name, ...Ingredient },
        });
        // setUserIngredients((prevIngredients) => [
        //   ...prevIngredients,
        //   { id: responseData.name, ...Ingredients },
        // ]);
      });
  };

  const removeIngredientsHandler = (ingredientId) => {
    //setIsLoading(true);
    dispatchHttp({ type: "RESPONSE" });
    fetch(
      `https://rect-hook-update.firebaseio.com/ingredients/${ingredientId}.jssson`,
      {
        method: "DELETE",
      }
    )
      .then((response) => {
        // setIsLoading(false);
        dispatch({ type: "DELETE", id: ingredientId });
        // setUserIngredients((prevIngredients) =>
        //   prevIngredients.filter((ingredient) => ingredient.id !== ingredientId)
        // );
      })
      .catch((error) => {
        dispatchHttp({ type: "ERROR", errorData: "Something went wrong" });
        // setError("Something went wrong");
        // setIsLoading(false);
      });
  };

  const clearError = () => {
    //setError(null);
    dispatchHttp({ type: "CLEAR" });
  };
  return (
    <div className="App">
      {httpState.error && (
        <ErrorModal onClose={clearError}>{httpState.error}</ErrorModal>
      )}
      <IngredientForm
        onAddIngredients={addIngredientsHandler}
        loading={httpState.loading}
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
