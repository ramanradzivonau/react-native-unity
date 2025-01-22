import React from 'react';

import NativeUnityView, { Commands } from './specs/UnityViewNativeComponent';
import type { DirectEventHandler } from 'react-native/Libraries/Types/CodegenTypes';
import { Platform } from 'react-native';

type UnityViewContentUpdateEvent = Readonly<{
  message: string;
}>;

export type RNUnityMethods = {
  postMessage: (
    gameObject: string,
    methodName: string,
    message: string
  ) => void;
  unloadUnity: () => void;
  pauseUnity: (pause: boolean) => void;
  resumeUnity: () => void;
  windowFocusChanged: (hasFocus: boolean) => void;
};

type RNUnityViewProps = {
  // ref: React.Ref<RNUnityMethods>;
  androidKeepPlayerMounted?: boolean;
  fullScreen?: boolean;
  onUnityMessage?: DirectEventHandler<UnityViewContentUpdateEvent>;
  onPlayerUnload?: DirectEventHandler<UnityViewContentUpdateEvent>;
  onPlayerQuit?: DirectEventHandler<UnityViewContentUpdateEvent>;
};

type ComponentRef = InstanceType<typeof NativeUnityView>;

export default class UnityView extends React.Component<RNUnityViewProps> {
  ref = React.createRef<ComponentRef>();

  public postMessage = (
    gameObject: string,
    methodName: string,
    message: string
  ) => {
    if (this.ref.current) {
      Commands.postMessage(this.ref.current, gameObject, methodName, message);
    }
  };

  public unloadUnity = () => {
    if (this.ref.current) {
      Commands.unloadUnity(this.ref.current);
    }
  };

  public setColor = (color: string) => {
    if (this.ref.current) {
      if (Platform.OS === 'android') {
        Commands.setColor(this.ref.current, color);
      }
    }
  };

  public pauseUnity(pause: boolean) {
    if (this.ref.current) {
      Commands.pauseUnity(this.ref.current, pause);
    }
  }

  public resumeUnity() {
    if (this.ref.current) {
      Commands.resumeUnity(this.ref.current);
    }
  }

  public windowFocusChanged(hasFocus = true) {
    if (Platform.OS !== 'android') return;

    if (this.ref.current) {
      Commands.windowFocusChanged(this.ref.current, hasFocus);
    }
  }

  private getProps() {
    return {
      ...this.props,
    };
  }

  componentWillUnmount() {
    if (this.ref.current) {
      if (Platform.OS === 'android') {
        Commands.setColor(this.ref.current, '#F8FBFC');
      }
      Commands.postMessage(this.ref.current, 'ABCLayout', 'Clear', '');
      Commands.unloadUnity(this.ref.current);
    }
  }

  render() {
    return <NativeUnityView ref={this.ref} {...this.getProps()} />;
  }
}
