import { View, Text, Switch, TextInput, ScrollView, Image } from 'react-native'
import Icon from '@expo/vector-icons/Feather'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import NLWLogo from '../src/assets/nlw-spacetime-logo.svg'
import { Link, useRouter } from 'expo-router'
import { TouchableOpacity } from 'react-native-gesture-handler'
import React, { useState } from 'react'
import * as ImagePicker from 'expo-image-picker'

import * as SecureStore from 'expo-secure-store'
import { api } from '../src/lib/api'
import { ImagePickerAsset } from 'expo-image-picker'

const NewMemory = () => {
  const { top, bottom } = useSafeAreaInsets()
  const router = useRouter()

  const [preview, setPreview] = useState<ImagePickerAsset | null>(null)
  const [isPublic, setIsPublic] = useState(false)
  const [content, setContent] = useState('')

  const openImagePicker = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        quality: 1,
        selectionLimit: 1,
      })
      if (result.assets[0]) {
        setPreview(result.assets[0])
      }
    } catch (err) {
      console.log(err)
    }
  }

  const handleCreateMemory = async () => {
    const token = await SecureStore.getItemAsync('token')

    let coverUrl = ''

    if (preview) {
      const uploadFormData = new FormData()

      const fileExtension = preview.uri.substring(
        preview.uri.lastIndexOf('.') + 1,
      )

      uploadFormData.append('file', {
        uri: preview.uri,
        name: `${preview.type}.${fileExtension}`,
        type:
          preview.type === 'image'
            ? `image/${fileExtension}`
            : `video/${fileExtension}`,
      } as any)

      const uploadResponse = await api.post('/upload', uploadFormData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      })

      coverUrl = uploadResponse.data.fileUrl
    }

    await api.post(
      '/memories',
      {
        coverUrl,
        content,
        isPublic,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )
    router.replace('/memories')
  }
  return (
    <ScrollView
      className="flex-1 px-8"
      contentContainerStyle={{ paddingBottom: bottom, paddingTop: top }}
    >
      <View className="mt-4 flex-row items-center justify-between">
        <NLWLogo />

        <Link href="/memories" asChild>
          <TouchableOpacity className="h-9 w-9 items-center justify-center rounded-full bg-purple-500">
            <Icon name="arrow-left" size={16} color="#FFF" />
          </TouchableOpacity>
        </Link>
      </View>
      <View className="mt-6 space-y-6">
        <View className="flex-row items-center gap-2">
          <Switch
            value={isPublic}
            onValueChange={setIsPublic}
            thumbColor={isPublic ? '#9b79ea' : '#9e9ea0'}
            trackColor={{ false: '#767577', true: '#372560' }}
          />
          <Text className="font-body text-base text-gray-200">
            Tornar memória pública
          </Text>
        </View>
        <TouchableOpacity
          onPress={openImagePicker}
          activeOpacity={0.7}
          className="h-32 items-center justify-center rounded-lg border border-dashed border-gray-500 bg-black/20 "
        >
          {preview ? (
            <Image
              className="h-full w-full rounded-lg object-cover"
              source={{ uri: preview.uri }}
              alt="Sua imagem está aqui"
            />
          ) : (
            <View className="flex-row items-center gap-2">
              <Icon name="image" color="#FFF" />
              <Text className="font-body text-sm text-gray-200">
                Adicionar foto ou vídeo de capa
              </Text>
            </View>
          )}
        </TouchableOpacity>

        <TextInput
          textBreakStrategy="highQuality"
          textAlign="right"
          value={content}
          onChangeText={setContent}
          multiline
          className="p-0 text-justify font-body text-lg text-gray-50"
          placeholderTextColor="#56566a"
          placeholder="Escreva seu relato aqui e sinta-se livre para adicionar fotos, vídeos e relatos sobre essa experiência que você quer lembrar para sempre!"
        />
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleCreateMemory}
          className=" w-2/3 items-center self-center rounded-full bg-green-500 px-5 py-3"
        >
          <Text className="font-alt text-sm uppercase">Salvar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

export default NewMemory
