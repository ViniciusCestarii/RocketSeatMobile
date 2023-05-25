import { StatusBar } from 'expo-status-bar'
import { ImageBackground, Text, View, TouchableOpacity } from 'react-native'
import { styled } from 'nativewind'
import { makeRedirectUri, useAuthRequest } from 'expo-auth-session'
import * as SecureStore from 'expo-secure-store'
import { useCallback, useEffect } from 'react'
import { api } from '../src/lib/api'
import { useRouter } from 'expo-router'

import {
  useFonts,
  Roboto_400Regular,
  Roboto_700Bold,
} from '@expo-google-fonts/roboto'
import { BaiJamjuree_700Bold } from '@expo-google-fonts/bai-jamjuree'

import blurBg from '../src/assets/bg-blur.png'
import Stripes from '../src/assets/bg-stripes.svg'
import NLWLogo from '../src/assets/nlw-spacetime-logo.svg'

const StyledStripes = styled(Stripes) // for nativewind to be able to style

const discovery = {
  authorizationEndpoint: 'https://github.com/login/oauth/authorize',
  tokenEndpoint: 'https://github.com/login/oauth/access_token',
  revocationEndpoint:
    'https://github.com/settings/connections/applications/0e3ad5365afcb4fb44ae',
}

// npm run start
export default function App() {
  const router = useRouter()

  const [hasLoadedFonts] = useFonts({
    Roboto_400Regular,
    Roboto_700Bold,
    BaiJamjuree_700Bold,
  })

  const [request, response, signInWithGithub] = useAuthRequest(
    {
      clientId: '0e3ad5365afcb4fb44ae',
      scopes: ['identity'],
      redirectUri: makeRedirectUri({
        scheme: 'nlwspacetime',
      }),
    },
    discovery,
  )

  const handleGithubOAuthCode = useCallback(
    async (code: string) => {
      const response = await api.post('/register', {
        code,
      })
      const { token } = response.data
      console.log(token)

      await SecureStore.setItemAsync('token', token) // storaging with expo-secure-store

      router.push('/memories')
    },
    [router],
  )

  useEffect(() => {
    console.log(
      makeRedirectUri({
        scheme: 'nlwspacetime', // check the github oauth callback url
      }),
    )
    if (response?.type === 'success') {
      const { code } = response.params

      handleGithubOAuthCode(code)
    }
  }, [response, handleGithubOAuthCode])

  if (!hasLoadedFonts) {
    return null
  }
  return (
    <ImageBackground
      source={blurBg}
      className=" relative flex-1 items-center bg-gray-900 px-8 py-10"
      imageStyle={{ position: 'absolute', left: '-40%' }}
    >
      <StyledStripes className="absolute left-2" />
      <View className="flex-1 items-center justify-center gap-6">
        <NLWLogo />
        <View className="space-y-2">
          <Text className="text-center font-title text-2xl leading-tight text-gray-50">
            Sua cápsula do tempo
          </Text>
          <Text className="text-center font-body leading-relaxed text-gray-100">
            Colecione momentos marcantes da sua jornada e compartilhe (se
            quiser) com o mundo!
          </Text>
        </View>
        <TouchableOpacity
          activeOpacity={0.7}
          className="rounded-full bg-green-500 px-5 py-3"
          onPress={() => signInWithGithub()}
        >
          <Text className="font-alt text-sm uppercase">
            Cadastrar lembrança
          </Text>
        </TouchableOpacity>
      </View>
      <Text className="text-center font-body leading-relaxed text-gray-200">
        Feito com 💜 no NLW da Rocketseat
      </Text>
      <StatusBar style="light" translucent />
    </ImageBackground>
  )
}

/*
// css in-JS

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

*/
