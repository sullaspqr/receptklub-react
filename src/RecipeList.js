import React, { useEffect, useState } from "react";
import { Spinner } from "./Spinner";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faPencilAlt, faTimes } from "@fortawesome/free-solid-svg-icons";
import { Modal } from "./Modal";

export function RecipeList() {
  const [recipes, setRecipes] = useState([]);
  const [isPending, setPending] = useState(false);
  const [deleteId, setDeleteId] = useState("");

  function fetchRecipes() {
    console.log("path: " + process.env.REACT_APP_BACKEND_URL );
    return fetch(process.env.REACT_APP_BACKEND_URL + "/api/recipes")
      .then((res) => res.json())
      .then(setRecipes);
  }

  useEffect(() => {
    setPending(true);
    fetchRecipes().finally(() => {
      setPending(false);
    });
  }, []);

  if (isPending) {
    return <Spinner />;
  }

  return (
    <React.Fragment>

      {deleteId !== "" ? (
        <Modal
          onApproved={async () => {
            setPending(true);
            await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/recipes/${deleteId}`, { method: "DELETE" });
            setDeleteId("");
            await fetchRecipes();
            setPending(false);
          }}
          onClosed={() => setDeleteId("")}
        >
          Biztosan törlöd a {recipes.find((recipe) => recipe.id === deleteId)?.name} receptjét?
        </Modal>
      ) : (
        ""
      )}
      {alignToRows(recipes).map((row, i) => (
        <div className="row mb-3" key={i}>
          {row.map((recipe) => (
            <div className="col-md-4" key={recipe.id}>
              <div className="card w-100 h-100">
                <img
                  className="card-img-top mb-2"
                  src={`${process.env.REACT_APP_BACKEND_URL}/static/images/${recipe.imageURL}`}
                />
                <div className="card-body">
                  <h5 className="card-title">{recipe.name}</h5>
                </div>
                <div className="w-75 p-3">
                  <NavLink to={`/recept-szerkesztes/${recipe.slug}`}>
                    <button className="btn btn-sm btn-outline-warning mr-2">
                      <FontAwesomeIcon icon={faPencilAlt} />
                    </button>
                  </NavLink>                      
                  <button
                    className="btn btn-sm btn-outline-danger mr-2"
                    onClick={() => {
                      setDeleteId(recipe.id);
                    }}
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </button>                   
                  <NavLink to={`/recept/${recipe.slug}`}>
                    <button className="btn btn-sm btn-outline-primary">
                      <FontAwesomeIcon icon={faEye} />
                    </button>
                  </NavLink>
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}
    </React.Fragment>
  );
}

const alignToRows = (items) =>
  items.slice().reduceRight((acc, curr, i, arr) => {
    acc.push(arr.splice(0, 3));
    return acc;
  }, []);
