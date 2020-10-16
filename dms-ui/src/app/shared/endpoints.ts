export const Endpoints = {
  retrieveAllPatientsData(): string {
    return 'https://syntheticmass.mitre.org/v1/fhir/Patient?_count=100&apikey=Nefg5ThMvGEXQKsfhDTKP6Sj3rPrDzNY';
  },
  retrievePatientsDataById(id: number): string {
    return `http://localhost:15437/Patient/${id}`;
  },

  fetchBasicRecord(): string {
    return 'https://syntheticmass.mitre.org/v1/fhir/Patient/c8a021dc-b91e-4fe7-b6ec-81c948013fc4?apikey=Nefg5ThMvGEXQKsfhDTKP6Sj3rPrDzNY';
  },

  fetchDetailedRecord(): string {
    return 'https://syntheticmass.mitre.org/v1/fhir/Patient/c8a021dc-b91e-4fe7-b6ec-81c948013fc4/$everything?apikey=Nefg5ThMvGEXQKsfhDTKP6Sj3rPrDzNY';
  },

  fetchGlucoseReadingsForPatient(id: number): string {
    return `http://localhost:15437/Observation?code=http://loinc.org~2339-0&Patient=${id}`;
  },

  fetchA1CReadingsForPatient(id: number): string {
    return `http://localhost:15437/Observation?code=http://loinc.org~41995-2&Patient=${id}`;
  },

  submitObservationReading(): string {
    return 'http://localhost:15437/Observation';
  }
};
