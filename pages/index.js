import { useEffect, useState } from "react";

function HomePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [recordLabels, setRecordLabels] = useState(null);

  useEffect(() => {
    const fetchFestivalsData = async () => {
      const data = await fetch("/api/festivals");

      if (!data.ok) {
        throw new Error(`Error fetching data: ${data.status}`);
      }

      const json = await data.json();

      if (json && json.length > 0) {
        let formattedRecordLabels = {};

        json.forEach((festival) => {
          festival?.bands?.forEach((band) => {
            const labelName = band.recordLabel ? band.recordLabel : "No label";
            const existingFestivalList =
              formattedRecordLabels?.[labelName]?.bands?.[band.name]?.festivals;
            let festivalList = [];
            if (festival.name && festival.name.length > 0) {
              festivalList = existingFestivalList
                ? [...existingFestivalList, ...[festival.name]]
                : [festival.name];
            } else {
              festivalList = existingFestivalList;
            }

            // Merge labels
            formattedRecordLabels = {
              ...formattedRecordLabels,
              ...{
                [labelName]: {
                  bands: {
                    // Merge bands
                    ...formattedRecordLabels?.[labelName]?.bands,
                    ...{ [band.name]: { festivals: festivalList } },
                  },
                },
              },
            };
          });
        });

        // Now sort alphabetically
        const sortRecordLabels = (objectToSort) => {
          if (Array.isArray(objectToSort)) {
            return objectToSort.sort();
          }
          if (typeof objectToSort !== "object") {
            return objectToSort;
          }
          const sortedObject = {};
          const keys = Object.keys(objectToSort).sort();
          keys.forEach(
            (key) => (sortedObject[key] = sortRecordLabels(objectToSort[key]))
          );
          return sortedObject;
        };

        const sortedRecordLabels = sortRecordLabels(formattedRecordLabels);

        setRecordLabels(sortedRecordLabels);
        setIsLoading(false);
      }
    };

    fetchFestivalsData().catch((error) => {
      setIsLoading(false);
      setErrorMessage(error.message);
    });
  }, []);

  return (
    <div>
      <h1>Music festival data</h1>
      {isLoading && <p>Loading...</p>}
      {errorMessage && <p>{errorMessage}</p>}
      {recordLabels && (
        <ul>
          {Object.entries(recordLabels).map(([recordLabelName, labelData]) => (
            <li key={recordLabelName}>
              {recordLabelName}
              {console.log(Object.entries(labelData.bands))}
              <ul>
                {Object.entries(labelData.bands).map(([bandName, bandData]) => (
                  <li key={`${recordLabelName}${bandName}`}>
                    {bandName}
                    {
                      <ul>
                        {bandData?.festivals?.map((festivalName) => (
                          <li
                            key={`${recordLabelName}${bandName}${festivalName}`}
                          >
                            {festivalName}
                          </li>
                        ))}
                      </ul>
                    }
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default HomePage;
