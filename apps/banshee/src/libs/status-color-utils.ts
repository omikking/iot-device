import { ProceqStatus } from '@/gql/graphql';

export const getStatusColorHex = (status?: string | null) => {
  switch (status) {
    case ProceqStatus.Elastic:
      return '#7FCC5B';
    case ProceqStatus.LowPlastic:
      return '#FFD74B';
    case ProceqStatus.HighPlastic:
      return '#F54B00';
    case ProceqStatus.Broken:
      return '#EB0D0D';
    case ProceqStatus.NotMeasurable:
      return '#9D9D9D';
    default:
      return '#9C9C9C';
  }
};

export const getStatusColor = (status?: string | null) => {
  switch (status) {
    case ProceqStatus.Elastic:
      return '#22c55e';
    case ProceqStatus.LowPlastic:
      return '#eab308';
    case ProceqStatus.HighPlastic:
      return '#fdba74';
    case ProceqStatus.Broken:
      return '#ef4444';
    case ProceqStatus.NotMeasurable:
      return '#9ca3af';
    default:
      return '#9ca3af';
  }
};
export const getStatusLabel = (status?: string | null) => {
  switch (status) {
    case ProceqStatus.Elastic:
      return 'Elastic';
    case ProceqStatus.LowPlastic:
      return 'Plastic low';
    case ProceqStatus.HighPlastic:
      return 'Plastic high';
    case ProceqStatus.Broken:
      return 'Broken';
    case ProceqStatus.NotMeasurable:
      return 'Not measurable';
    default:
      return status || 'N/A';
  }
};
