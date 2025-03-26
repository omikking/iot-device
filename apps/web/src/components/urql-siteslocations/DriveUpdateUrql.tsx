import { graphql } from '@/gql';
import { useMutation } from 'urql';

type UpdateDriveInput = {
  driveName: string;
};

const updateDrivesMutation = graphql(`
  mutation updateDrive($id: String!, $updateDriveInput: UpdateDriveInput!) {
    updateDrive(id: $id, updateDriveInput: $updateDriveInput) {
      id
      driveName
    }
  }
`);

export const DriveUpdateUrql = () => {
  const [result, updateDriveMutation] = useMutation(updateDrivesMutation);

  const updateDrive = async (id: string, input: UpdateDriveInput) => {
    console.log('Updating drive with:', { id, input });

    const response = await updateDriveMutation({
      id,
      updateDriveInput: input,
    });

    console.log('Mutation response:', response);

    if (response.error) {
      console.error('Mutation error:', response.error);
      throw response.error;
    }

    return response.data?.updateDrive;
  };

  return { updateDrive, result };
};
