export default async function fetchProgressionList(data: any) {
  try {
    const res = await fetch(
      'https://sandbox.credentialengine.org/publisher/PathwayBuilderApi/Search/Resource/Pathway_HasProgressionModel?userCreds=tara.mueller%40protiviti.com~ceI$Awesome',
      {
        method: 'post', // *GET, POST, PUT, DELETE, etc.
        body: JSON.stringify(data), // body data type must match "Content-Type" header
      }
    ).then(async (response) => {
      const json = await response.json();
      return json;
    });
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
