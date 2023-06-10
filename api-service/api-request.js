const LinkApi = {
  getFoodIngredients: async () => {
    try {
      const response = await fetch(
        "https://trackapi.nutritionix.com/v2/search/item?nix_item_id=513fc9e73fe3ffd40300109f",
        {
          method: "GET",
          headers: {
            "x-app-id": "dae115c7",
            "x-app-key": "0663d4c3b7c6f582574b174d80f0478e",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        throw new Error("Erreur de requête");
      }
    } catch (error) {
      console.error(error);
      return [];
    }
  },
};

const testApi = async () => {
  const result = await LinkApi.getFoodIngredients();
  console.log(result);
};

testApi();
