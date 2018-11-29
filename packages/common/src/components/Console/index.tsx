import React from 'react';
import { withTheme } from 'styled-components';

import { Icon } from 'office-ui-fabric-react/lib/Icon';
import { Checkbox } from 'office-ui-fabric-react/lib/Checkbox';
import { List, ScrollToMode, IListProps } from 'office-ui-fabric-react/lib/List';
import { FocusZone } from 'office-ui-fabric-react/lib/FocusZone';

import {
  Wrapper,
  CheckboxWrapper,
  ClearButton,
  FilterWrapper,
  LogsArea,
  LogsList,
  Log,
  LogText,
} from './styles';
import HeaderFooterLayout from '../HeaderFooterLayout';

export enum ConsoleLogSeverities {
  Info = 'info',
  Log = 'log',
  Warn = 'warn',
  Error = 'error',
}

export interface IProps {
  logs: ILogData[];
  clearLogs: () => void;
  style?: object;
}

interface IPrivateProps extends IProps {
  theme: ITheme;
}

interface IState {
  shouldScrollToBottom: boolean;
  filterQuery: string;
}

class Console extends React.Component<IPrivateProps, IState> {
  private list: List;

  static defaultProps = {
    style: {},
  };

  constructor(props: IPrivateProps) {
    super(props);
    this.state = { shouldScrollToBottom: true, filterQuery: '' };
  }

  componentDidMount() {
    this.scrollToBottom();
  }

  componentDidUpdate() {
    this.scrollToBottom();
  }

  setShouldScrollToBottom = (ev: React.FormEvent<HTMLElement>, checked: boolean) =>
    this.setState({ shouldScrollToBottom: checked });

  updateFilterQuery = () =>
    this.setState({
      filterQuery: (this.refs.filterTextInput as any).value.toLowerCase(),
    });

  scrollToBottom() {
    if (this.state.shouldScrollToBottom && this.list) {
      this.list.scrollToIndex(this.props.logs.length);
    }
  }

  render() {
    const { theme, logs, clearLogs, style } = this.props;

    const items = logs
      .filter(log => log.message.toLowerCase().includes(this.state.filterQuery))
      .map(({ severity, message }, i) => {
        const { backgroundColor, color, icon } = {
          [ConsoleLogSeverities.Log]: {
            backgroundColor: theme.white,
            color: theme.black,
            icon: null,
          },
          [ConsoleLogSeverities.Info]: {
            backgroundColor: '#cce6ff',
            color: theme.black,
            icon: { name: 'Info', color: '#002db3' },
          },
          [ConsoleLogSeverities.Warn]: {
            backgroundColor: '#fff4ce',
            color: theme.black,
            icon: { name: 'Warning', color: 'gold' },
          },
          [ConsoleLogSeverities.Error]: {
            backgroundColor: '#fde7e9',
            color: theme.black,
            icon: { name: 'Error', color: 'red' },
          },
        }[severity];

        return {
          key: `${severity}-${i}`,
          backgroundColor,
          color,
          icon,
          message,
        };
      });

    return (
      <Wrapper style={{ backgroundColor: theme.neutralLighter, ...style }}>
        <HeaderFooterLayout
          header={
            <FilterWrapper>
              <ClearButton onClick={clearLogs}>
                <Icon
                  style={{
                    width: '2rem',
                    height: '2rem',
                    lineHeight: '2rem',
                  }}
                  iconName="Clear"
                />
              </ClearButton>
              <input
                className="ms-font-m"
                type="text"
                placeholder="Filter"
                onChange={this.updateFilterQuery}
                ref="filterTextInput"
                style={{
                  width: '100%',
                  height: '3.2rem',
                  padding: '0.6rem',
                  boxSizing: 'border-box',
                }}
              />
            </FilterWrapper>
          }
          footer={
            <CheckboxWrapper>
              <Checkbox
                label="Auto-scroll"
                defaultChecked={true}
                onChange={this.setShouldScrollToBottom}
              />
            </CheckboxWrapper>
          }
        >
          <LogsArea>
            <div>
              <List
                ref={this.resolveList}
                items={items}
                onRenderCell={this.onRenderCell}
              />
            </div>
          </LogsArea>
        </HeaderFooterLayout>
      </Wrapper>
    );
  }

  private resolveList = (list: List): void => {
    this.list = list;
  };

  private onRenderCell = (
    { key, backgroundColor, color, icon, message }: any,
    index: number,
  ): JSX.Element => {
    return (
      <Log key={key} style={{ backgroundColor, color }}>
        {icon ? (
          <Icon
            className="ms-font-m"
            iconName={icon.name}
            style={{
              fontSize: '1.2rem',
              color: icon.color,
              lineHeight: '1.2rem',
            }}
          />
        ) : (
          <div style={{ width: '1.2rem', height: '1.2rem' }} />
        )}
        <LogText>{message}</LogText>
      </Log>
    );
  };
}

export default withTheme(Console);