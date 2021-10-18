import { createContext, useContext, useReducer } from 'react'

type Action = { type: 'set-left-handed'; payload: boolean }

type Dispatch = (action: Action) => void

type State = {
  leftHanded: boolean
}

type SettingsProviderProps = { children: React.ReactNode }

const SettingsStateContext = createContext<State | undefined>(undefined)
const SettingsDispatchContext = createContext<Dispatch | undefined>(undefined)

export function setLeftHanded(value: boolean): Action {
  localStorage.setItem('left-handed', value.toString())
  return { type: 'set-left-handed', payload: value }
}

function settingsReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'set-left-handed': {
      return { ...state, leftHanded: action.payload }
    }
    default: {
      return state
    }
  }
}

const initialState: State = {
  // || 'true' covers the case when no `left-handed` in storage
  leftHanded: (localStorage.getItem('left-handed') || 'true') === 'true',
}

export function SettingsProvider(props: SettingsProviderProps) {
  const [state, dispatch] = useReducer(settingsReducer, initialState)
  return (
    <SettingsStateContext.Provider value={state}>
      <SettingsDispatchContext.Provider value={dispatch}>{props.children}</SettingsDispatchContext.Provider>
    </SettingsStateContext.Provider>
  )
}

export function useSettingsState() {
  const context = useContext(SettingsStateContext)
  if (context === undefined) {
    throw new Error('useSettingsState must be used within a SettingsProvider')
  }
  return context
}

export function useSettingsDispatch() {
  const context = useContext(SettingsDispatchContext)
  if (context === undefined) {
    throw new Error('useSettingsDispatch must be used within a SettingsProvider')
  }
  return context
}

export function useSettings(): [State, Dispatch] {
  return [useSettingsState(), useSettingsDispatch()]
}
