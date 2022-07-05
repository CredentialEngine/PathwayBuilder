import React from 'react';

export interface Props {
  key: string;
  name?: string;
  children: React.ReactNode;
}

export const TabPane: React.FC<Props> = (props: Props) => <>{props.children}</>;

export default TabPane;
