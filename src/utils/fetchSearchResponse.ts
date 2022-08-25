export default async function fetchProgressionList(data: any) {
  try {
    const res = await fetch(
      'https://sandbox.credentialengine.org/publisher/PathwayBuilderApi/Search/Resource/Pathway_HasProgressionModel?userCreds=tara.mueller%40protiviti.com~ceI$Awesome',
      {
        method: 'post', // *GET, POST, PUT, DELETE, etc.
        // mode: 'cors', // no-cors, *cors, same-origin
        // cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        // credentials: 'same-origin', // include, *same-origin, omit
        // headers: {
        //   'Content-Type': 'application/json',
        //   // 'Content-Type': 'application/x-www-form-urlencoded',
        // },
        // redirect: 'follow', // manual, *follow, error
        // referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(data), // body data type must match "Content-Type" header
      }
    ).then(async (response) => {
      const json = await response.json();
      return json;
    });

    console.log('aaappp--->', res); // parses JSON response into native JavaScript objects

    if (res?.Valid) {
      const updatedProgressionModel = res?.Data.Results.map((dta: any) => ({
        Name: dta.Name,
        Description: dta.Description,
        Id: dta.Id,
        CTID: dta.CTID,
        RowId: dta.RowId,
        label: dta.Name,
        value: dta.Name,
        created: dta.created,
        lastUpdated: dta.lastUpdated,
        LastUpdatedById: dta.LastUpdatedById,
      }));

      const updatedProgressionLevel = res.Data.RelatedResources.map(
        (dta: any) => ({
          Name: dta.Name,
          Description: dta.Description,
          Id: dta.Id,
          RowId: dta.RowId,
          label: dta.Name,
          value: dta.Name,
          created: dta.created,
          lastUpdated: dta.lastUpdated,
          LastUpdatedById: dta.LastUpdatedById,
          CTID: dta.CTID,
          InProgressionModel: dta.InProgressionModel,
          hasChild: dta.hasChild,
        })
      );
      return { updatedProgressionModel, updatedProgressionLevel };
    }
  } catch (error: any) {
    console.log(error.response); // this is the main part. Use the response property from the error object
  }
}
