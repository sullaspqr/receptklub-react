import React, { useEffect, useState } from "react";
import "./App.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from "@fortawesome/free-solid-svg-icons";
import { Spinner } from "./Spinner";

export function RecipeSingle(props) {
  const [recipe, setRecipe] = useState();
  const [selectedStepIndex, setSelectedStepIndex] = useState(0);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/api/recipes/${props.match.params.recipeSlug}`)
      .then((res) => res.json())
      .then(setRecipe);
  }, []);

  if (!recipe) {
    return <Spinner />;
  }

  return (
    <div>
      <div className="row m-2">
        <div className="col-md-8">
          <h1>{recipe.name}</h1>

          <div className="p-2">
            <h3>Hozzávalók:</h3>
            <ul className="list-group list-group-flush">
              {recipe.ingredients.map((ingredient, i) => (
                <li key={i} className="list-group-item">
                  {ingredient.name} ({ingredient.quantity})
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="col-md-4 m-auto">
          <img
            width="100%"
            className="card-img-top mb-2"
            src={`${process.env.REACT_APP_BACKEND_URL}/static/images/${recipe.imageURL}`}
            alt="Card image cap"
          />
        </div>
      </div>
      <div className="row p-3">
        <div className="col-md-9 border-right">
          <h3>Elkészítés:</h3>
          <ul className="list-group list-group-flush">
            {recipe.steps.map((step, i) => (
              <li
                key={i}
                className={"list-group-item " + (selectedStepIndex === i ? "active" : "")}
                onClick={() => {
                  setSelectedStepIndex(i);
                }}
              >
                {step.content}
              </li>
            ))}
          </ul>
        </div>
        <div className="col-md-3 border-right">
          <div className="card">
            <div className="card-body">
              <h2>
                <FontAwesomeIcon icon={faClock} className="mr-2" />
                {recipe.steps[selectedStepIndex]?.timer ? recipe.steps[selectedStepIndex].timer + " perc" : "-"}
              </h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}