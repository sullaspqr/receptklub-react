import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { Spinner } from "./Spinner";
import { useHistory } from "react-router";
import { transformToStructure, uuidv4 } from "./RecipeCreate";

export function RecipeEdit(props) {
  const [recipe, setRecipe] = useState();
  const [ingredients, setIngredients] = useState([]);
  const [steps, setSteps] = useState([]);
  const [isPending, setPending] = useState();
  const history = useHistory();

  function fetchRecipeBySlug() {
    return fetch(`${process.env.REACT_APP_BACKEND_URL}/api/recipes/${props.match.params.recipeSlug}`)
      .then((res) => res.json())
      .then((recipe) => {
        setRecipe(recipe);
        setIngredients(recipe.ingredients.map((ingredient) => [uuidv4(), ingredient]));
        setSteps(recipe.steps.map((step) => [uuidv4(), step]));
      });
  }

  useEffect(() => {
    setPending(true);
    fetchRecipeBySlug();
    setPending(false);
  }, []);

  if (isPending || !recipe) {
    return <Spinner />;
  }

  return (
    <div className="card p-3">
      <h1>Recept szerkesztése:</h1>
      <hr />
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const formData = new FormData();
          formData.append("name", e.target.elements.name.value);
          formData.append("ingredients", JSON.stringify(transformToStructure(e.target.elements, "ingredient")));
          formData.append("steps", JSON.stringify(transformToStructure(e.target.elements, "step")));
          formData.append("image", e.target.elements["img-url"].files[0]);
          setPending(true);
          await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/recipes/${recipe.id}`, {
            method: "PUT",
            body: formData,
          });
          await fetchRecipeBySlug();
          setPending(false);
          history.push("/receptek");
        }}
      >
        <div className="form-group row pb-3 border-bottom">
          <label className="col-sm-2 col-form-label">Név:</label>
          <div className="col-sm-10">
            <input type="text" name="name" className="form-control" defaultValue={recipe.name} required />
          </div>
        </div>
        <div className="form-group row pb-3 border-bottom">
          <label className="col-sm-2 col-form-label">Hozzávalók:</label>
          {ingredients.map(([ingredientId, ingredient], i) => (
            <div key={ingredientId} className="col-sm-10 offset-2">
              <div className={"row mb-3 " + (i === ingredients.length - 1 ? "" : "border-bottom")}>
                <div className="col-md-6">
                  <input
                    type="text"
                    name={"ingredient-name-" + i}
                    className="form-control d-inline-block mr-2 mb-2"
                    placeholder="Név"
                    defaultValue={ingredient.name}
                    required
                  />
                </div>
                <div className="col-md-2">
                  <input
                    type="text"
                    name={"ingredient-quantity-" + i}
                    className="form-control d-inline-block mr-2 mb-2"
                    placeholder="Mennyiség"
                    defaultValue={ingredient.quantity}
                    required
                  />
                </div>
                <div className="col-md-2">
                  <select
                    name={"ingredient-type-" + i}
                    className="form-control d-inline-block mr-2 mb-2"
                    defaultValue={ingredient.type}
                    required
                  >
                    <option value="" disabled>
                      Típus
                    </option>
                    <option value="meat">Hús</option>
                    <option value="drink">Ital</option>
                    <option value="dairy">Tejtermék</option>
                    <option value="fruit">Gyümölcs</option>
                    <option value="spice">Fűszer</option>
                    <option value="spice">Egyéb</option>
                  </select>
                </div>
                <div className="col-md-2">
                  <div className="w-100">
                    <button
                      className="btn btn-danger mb-3"
                      type="button"
                      onClick={() => {
                        setIngredients((prev) => {
                          const ret = [...prev];
                          ret.splice(
                            prev.findIndex(([id]) => id === ingredientId),
                            1
                          );
                          return ret;
                        });
                      }}
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div className="row w-100">
            <div className="col-md-3 offset-md-9">
              <button
                type="button"
                className="btn btn-success btn-sm float-right"
                onClick={() => {
                  setIngredients((prev) => [
                    ...prev,
                    [
                      uuidv4(),
                      {
                        name: "",
                        type: "",
                        quantity: "",
                      },
                    ],
                  ]);
                }}
              >
                <FontAwesomeIcon icon={faPlus} />
              </button>
            </div>
          </div>
        </div>
        <div className="form-group row pb-3 border-bottom">
          <label className="col-sm-2 col-form-label">Lépések:</label>
          {steps.map(([stepId, step], i) => (
            <div key={stepId} className="col-sm-10 offset-2">
              <div className={"row mb-3 " + (i === steps.length - 1 ? "" : "border-bottom")}>
                <div className="col-md-6">
                  <input
                    type="text"
                    name={"step-content-" + i}
                    className="form-control d-inline-block mr-2 mb-2"
                    placeholder={i + 1 + ". lépés"}
                    defaultValue={step.content}
                    required
                  />
                </div>
                <div className="col-md-2">
                  <input
                    type="number"
                    name={"step-timer-" + i}
                    className="form-control d-inline-block mr-2 mb-2"
                    placeholder="Idő"
                    defaultValue={step.timer}
                    required
                  />
                </div>
                <div className="col-md-2">
                    <div className="w-100">
                      <button
                        className="btn btn-danger mb-3"
                        type="button"
                        onClick={() => {
                          setSteps((prev) => {
                            const ret = [...prev];
                            ret.splice(
                              prev.findIndex(([item, _]) => item === stepId),
                              1
                            );
                            return ret;
                          });
                        }}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                </div>
              </div>
            </div>
          ))}
          <div className="row w-100">
            <div className="col-md-3 offset-md-9">
              <button
                type="button"
                className="btn btn-success btn-sm float-right"
                onClick={() => {
                  setSteps((prev) => [...prev, [uuidv4(), { content: "", timer: 0 }]]);
                }}
              >
                <FontAwesomeIcon icon={faPlus} />
              </button>
            </div>
          </div>
        </div>
        <div className="form-group row pb-3 border-bottom">
          <label className="col-sm-2 col-form-label">Kép:</label>
          <div className="col-md-5">
            <input type="file" name="img-url" className="form-control" />
          </div>
          <div className="col-md-5">
            <img
              src={`${process.env.REACT_APP_BACKEND_URL}/static/images/${recipe.imageURL}`}
              className="img-thumbnail"
            />
          </div>
        </div>
        <button type="submit" className="btn btn-success btn-sm">
          Küldés <FontAwesomeIcon icon={faCheckCircle} />
        </button>
      </form>
    </div>
  );
}