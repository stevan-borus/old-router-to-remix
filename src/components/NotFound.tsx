import { FC } from 'react';

type Props = {
  resource: string;
};

const NotFound: FC<Props> = ({ resource }) => {
  return <h3 className='text-2xl font-bold tracking-tight'>{resource} not found</h3>;
};

export default NotFound;
