import React, { useEffect, useMemo, useState } from 'react'
import { View, Text, TextInput, StyleSheet, Pressable, ScrollView, Alert, Modal, TouchableOpacity, Image } from 'react-native'
import * as DocumentPicker from 'expo-document-picker'
import { Ionicons } from '@expo/vector-icons'
import { Link, router, useLocalSearchParams } from 'expo-router'
import type { EventItem } from '../data/events'
import { mockApi } from '../services/mockApi'
import ThemedText from '@/components/ThemedText'
import Spacer from '@/components/spacer'

type EventMode = 'Online' | 'Offline' | 'Hybrid'
type EventType = EventItem['type']

type Organizer = { parentOrganization: string; eventOrganizer: string }
type Contact = { name: string; role: string; phone: string }

type PickedFile = {
  uri: string
  name?: string
  size?: number
  mimeType?: string
  type?: string
  data?: Blob
}

type EventForm = {
  title: string
  description: string
  imageUrl: string
  eligibility: string
  date: string // dd-mm-yyyy
  startTime: string
  endTime: string
  mode: EventMode | ''
  venue: string
  fee: string
  organizers: Organizer[]
  contacts: Contact[]
  registrationLink: string
  type: EventType
}

type DayCell = {
  date: number
  month: number
  year: number
  isCurrentMonth: boolean
}

const getDaysInMonth = (date: Date): DayCell[] => {
  const year = date.getFullYear()
  const month = date.getMonth()
  const firstDay = new Date(year, month, 1)
  const startDate = new Date(firstDay)
  startDate.setDate(startDate.getDate() - firstDay.getDay())
  
  const days: DayCell[] = []
  for (let i = 0; i < 42; i++) {
    const currentDate = new Date(startDate)
    currentDate.setDate(startDate.getDate() + i)
    
    days.push({
      date: currentDate.getDate(),
      month: currentDate.getMonth(),
      year: currentDate.getFullYear(),
      isCurrentMonth: currentDate.getMonth() === month
    })
  }
  return days
}

const EVENT_TYPES: EventType[] = ['Workshop', 'Seminar', 'Guest Lecture', 'Industrial Visit', 'Cultural', 'Sports']
const MODES: EventMode[] = ['Online', 'Offline', 'Hybrid']

export default function EditEventForm() {
  const { id } = useLocalSearchParams<{ id?: string }>()
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState<EventForm>({
    title: '',
    description: '',
    imageUrl: '',
    eligibility: '',
    date: '',
    startTime: '',
    endTime: '',
    mode: '',
    venue: '',
    fee: '',
    organizers: [{ parentOrganization: '', eventOrganizer: '' }],
    contacts: [{ name: '', role: '', phone: '' }],
    registrationLink: '',
    type: 'Workshop',
  })
  const [submitting, setSubmitting] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<PickedFile | null>(null)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [calendarMonth, setCalendarMonth] = useState<Date>(new Date())
  const [showTimePicker, setShowTimePicker] = useState(false)
  const [selectedTime, setSelectedTime] = useState(new Date())
  const [timePickerType, setTimePickerType] = useState<'start' | 'end'>('start')
  const [errors, setErrors] = useState<{ date: string; fee: string; contactPhones: string[] }>({
    date: '',
    fee: '',
    contactPhones: [''],
  })
  const [isDateConfirmed, setIsDateConfirmed] = useState<boolean>(false)

  // --- File Upload Handlers ---
  const handleFileUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['image/*', 'image/jpeg', 'image/png', 'image/gif'],
        copyToCacheDirectory: true,
        multiple: false,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        
        // Check file size (10MB limit)
        if (file.size && file.size > 10 * 1024 * 1024) {
          Alert.alert('File Too Large', 'Please select a file smaller than 10MB.');
          return;
        }

        // Check file type
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!file.mimeType || !allowedTypes.includes(file.mimeType)) {
          Alert.alert('Invalid File Type', 'Please select a PNG, JPG, or GIF file.');
          return;
        }

        // Create a file object with the necessary properties for FormData
        const fileWithData = {
          uri: file.uri,
          name: file.name || `image-${Date.now()}.jpg`,
          type: file.mimeType || 'image/jpeg',
          mimeType: file.mimeType || 'image/jpeg', // Keep mimeType for compatibility
        };

        setUploadedFile(fileWithData);
      }
    } catch (error) {
      console.error('Error picking document:', error);
      Alert.alert('Error', 'Failed to select file. Please try again.');
    }
  };

  // --- Date/Time Picker Handlers ---
  const handleDatePress = () => {
    // Set the selected date to the current form date if it exists
    if (form.date) {
      const [day, month, year] = form.date.split('-').map(Number)
      if (day && month && year) {
        setSelectedDate(new Date(year, month - 1, day))
        setCalendarMonth(new Date(year, month - 1, day))
      }
    }
    setShowDatePicker(true);
  };

  const handlePreviousMonth = () => {
    const newMonth = new Date(calendarMonth);
    newMonth.setMonth(newMonth.getMonth() - 1);
    setCalendarMonth(newMonth);
  };

  const handleNextMonth = () => {
    const newMonth = new Date(calendarMonth);
    newMonth.setMonth(newMonth.getMonth() + 1);
    setCalendarMonth(newMonth);
  };

  const handleDateConfirm = () => {
    const day = selectedDate.getDate().toString().padStart(2, '0');
    const month = (selectedDate.getMonth() + 1).toString().padStart(2, '0');
    const year = selectedDate.getFullYear();
    const formattedDate = `${day}-${month}-${year}`;
    
    onChange('date', formattedDate);
    setShowDatePicker(false);
  };

  const handleDateCancel = () => {
    setShowDatePicker(false);
  };

  const handleTimePress = (type: 'start' | 'end') => {
    setTimePickerType(type);
    
    // Set the selected time to the current form time if it exists
    const currentTime = type === 'start' ? form.startTime : form.endTime;
    if (currentTime) {
      // Parse the time string (e.g., "10:40 PM")
      const timeMatch = currentTime.match(/(\d+):(\d+)\s*(AM|PM)/i);
      if (timeMatch) {
        let hours = parseInt(timeMatch[1], 10);
        const minutes = parseInt(timeMatch[2], 10);
        const isPM = timeMatch[3].toUpperCase() === 'PM';
        
        if (isPM && hours !== 12) hours += 12;
        if (!isPM && hours === 12) hours = 0;
        
        const newTime = new Date();
        newTime.setHours(hours, minutes, 0, 0);
        setSelectedTime(newTime);
      }
    }
    
    setShowTimePicker(true);
  };

  const handleTimeConfirm = () => {
    const hours = selectedTime.getHours();
    const minutes = selectedTime.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    const formattedTime = `${displayHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${ampm}`;
    
    if (timePickerType === 'start') {
      onChange('startTime', formattedTime);
    } else {
      onChange('endTime', formattedTime);
    }
    
    setShowTimePicker(false);
  };

  const handleTimeCancel = () => {
    setShowTimePicker(false);
  };

  // --- Validators ---
  function sanitizeAndValidateDate(input: string): { sanitized: string; error: string } {
    const digits = (input || '').replace(/\D/g, '').slice(0, 8)
    let sanitized = digits
    if (digits.length > 4) {
      sanitized = `${digits.slice(0, 2)}-${digits.slice(2, 4)}-${digits.slice(4)}`
    } else if (digits.length > 2) {
      sanitized = `${digits.slice(0, 2)}-${digits.slice(2)}`
    }

    if (digits.length === 0) return { sanitized, error: '' }
    if (digits.length < 8) return { sanitized, error: 'Enter a full date in dd-mm-yyyy' }

    const day = parseInt(digits.slice(0, 2), 10)
    const month = parseInt(digits.slice(2, 4), 10)
    const year = parseInt(digits.slice(4), 10)
    if (month < 1 || month > 12) return { sanitized, error: 'Month must be between 01 and 12' }
    if (year < 1900 || year > 2100) return { sanitized, error: 'Year must be between 1900 and 2100' }
    const d = new Date(year, month - 1, day)
    const isRealDate = d.getFullYear() === year && d.getMonth() === month - 1 && d.getDate() === day
    return { sanitized, error: isRealDate ? '' : 'Enter a valid calendar date' }
  }

  function sanitizeAndValidatePhone(input: string): { sanitized: string; error: string } {
    const hasPlus = (input || '').trim().startsWith('+')
    const digits = (input || '').replace(/\D/g, '').slice(0, 15)
    const sanitized = `${hasPlus ? '+' : ''}${digits}`
    if (digits.length === 0) return { sanitized, error: '' }
    if (digits.length < 10) return { sanitized, error: 'Enter at least 10 digits' }
    return { sanitized, error: '' }
  }

  function sanitizeAndValidateNumber(input: string): { sanitized: string; error: string } {
    let sanitized = (input || '').replace(/[^0-9.]/g, '')
    const firstDot = sanitized.indexOf('.')
    if (firstDot !== -1) {
      sanitized = sanitized.slice(0, firstDot + 1) + sanitized.slice(firstDot + 1).replace(/\./g, '')
    }
    if (sanitized === '.') sanitized = '0.'
    if (sanitized === '') return { sanitized, error: '' }
    const valid = /^\d+(\.\d+)?$/.test(sanitized)
    return { sanitized, error: valid ? '' : 'Enter a valid number' }
  }

  useEffect(() => {
    const load = async () => {
      try {
        if (!id) return
        const ev = await mockApi.getPublisherEventById(String(id))
        if (ev) {
          setForm((prev) => {
            const newForm = {
              ...prev,
              title: ev.title || prev.title,
              description: ev.description || prev.description,
              imageUrl: (ev as any)?.image?.uri || prev.imageUrl,
              eligibility: (ev as any)?.eligibility || prev.eligibility,
              date: (ev as any)?.date || prev.date,
              startTime: (ev as any)?.time || prev.startTime,
              endTime: (ev as any)?.endTime || prev.endTime,
              mode: (ev as any)?.mode || prev.mode,
              venue: (ev as any)?.venue || prev.venue,
              fee: (ev as any)?.fee || prev.fee,
              organizers:
                (ev as any)?.organizers?.map((o: any) => ({
                  parentOrganization: o.subtitle || '',
                  eventOrganizer: o.name || '',
                })) || prev.organizers,
              contacts:
                (ev as any)?.contacts?.map((c: any) => ({
                  name: c.name || '',
                  role: c.role || '',
                  phone: c.phone || '',
                })) || prev.contacts,
              registrationLink: (ev as any)?.registrationLink || prev.registrationLink,
              type: ((ev as any)?.type || (ev as any)?.category || prev.type) as EventType,
            };
            return newForm;
          })
          const contactsLen = (ev as any)?.contacts?.length || 1
          setErrors((prev) => ({ ...prev, contactPhones: Array.from({ length: contactsLen }, () => '') }))
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to load event data. Please try again.')
        console.error('Failed to load event:', error)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  const onChange = <K extends keyof EventForm>(key: K, value: EventForm[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  const hasRequired = useMemo(() => form.title.trim().length > 0 && form.description.trim().length > 0, [form.title, form.description])
  const hasValidationErrors = useMemo(
    () => Boolean(errors.date || errors.fee || (errors.contactPhones && errors.contactPhones.some((e) => !!e))),
    [errors]
  )
  const canSubmit = useMemo(() => hasRequired && !hasValidationErrors, [hasRequired, hasValidationErrors])

  function updateOrganizer(index: number, key: keyof Organizer, value: string) {
    setForm((prev) => {
      const next = [...prev.organizers]
      next[index] = { ...next[index], [key]: value }
      return { ...prev, organizers: next }
    })
  }

  function addOrganizer() {
    setForm((prev) => ({ ...prev, organizers: [...prev.organizers, { parentOrganization: '', eventOrganizer: '' }] }))
  }

  function removeOrganizer(index: number) {
    setForm((prev) => ({ ...prev, organizers: prev.organizers.filter((_, i) => i !== index) }))
  }

  function updateContact(index: number, key: keyof Contact, value: string) {
    setForm((prev) => {
      const next = [...prev.contacts]
      next[index] = { ...next[index], [key]: value }
      return { ...prev, contacts: next }
    })
  }

  function addContact() {
    setForm((prev) => ({ ...prev, contacts: [...prev.contacts, { name: '', role: '', phone: '' }] }))
    setErrors((prev) => ({ ...prev, contactPhones: [...(prev.contactPhones || []), ''] }))
  }

  function removeContact(index: number) {
    setForm((prev) => ({ ...prev, contacts: prev.contacts.filter((_, i) => i !== index) }))
    setErrors((prev) => ({
      ...prev,
      contactPhones: (prev.contactPhones || []).filter((_, i) => i !== index),
    }))
  }

  async function onSubmit() {
    if (!hasRequired) {
      Alert.alert('Missing fields', 'Please fill the required fields (Title, Description)')
      return
    }
    if (hasValidationErrors) {
      Alert.alert('Invalid fields', 'Please fix the highlighted fields before submitting.')
      return
    }
    setSubmitting(true)
    try {
      const payload = { ...form }
      
      // Prepare the file for upload if one was selected
      const imageFile = uploadedFile ? {
        uri: uploadedFile.uri,
        name: uploadedFile.name || `image-${Date.now()}.jpg`,
        type: uploadedFile.type || uploadedFile.mimeType || 'image/jpeg',
        mimeType: uploadedFile.mimeType || uploadedFile.type || 'image/jpeg', // Keep mimeType for compatibility
      } : null;

      // Pass both the form data and the image file to the API
      const res = await mockApi.updatePublisherEvent(String(id), payload, imageFile)
      
      if (res?.success) {
        Alert.alert('Success', res.message || 'Event updated successfully')
        router.replace('/(dashboard-publisher)/publisherHome')
      } else {
        Alert.alert('Error', res?.message || 'Failed to update event')
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update event. Please try again.')
      console.error('Failed to update event:', error)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Edit Event</Text>
        <Text style={{ color: '#64748b' }}>Loading...</Text>
      </ScrollView>
    )
  }

  return (
    <ScrollView 
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.headerRow}>
        <Text style={[styles.title, { marginTop: 20}]}>Edit Event</Text>
        <Link href="/(dashboard-publisher)/publisherHome" style={[styles.linkBack, { marginTop: 20}]}>Back</Link>
      </View>

      {/* Event Title */}
      <Label text="Event Title" />
      <TextInput placeholder="Enter event title" style={styles.input} value={form.title} onChangeText={(t) => onChange('title', t)} />

      {/* Event Description */}
      <Label text="Event Description" />
      <TextInput
        placeholder="Enter event description"
        style={[styles.input, styles.textarea]}
        multiline
        value={form.description}
        onChangeText={(t) => onChange('description', t)}
      />

      {/* Event Thumbnail */}
      <View style={{ marginTop: 16 }}>
        <Text style={styles.label}>Event Thumbnail</Text>
        <TouchableOpacity 
          style={styles.uploadBox} 
          onPress={handleFileUpload}
        >
          {uploadedFile ? (
            <View style={styles.uploadedFileContainer}>
              <Image
                source={{ uri: uploadedFile.uri }}
                style={styles.uploadedImage}
                resizeMode="cover"
              />
              <View style={styles.fileInfo}>
                <Text style={styles.fileName}>{uploadedFile.name}</Text>
                <Text style={styles.uploadSubtitle}>
                  {uploadedFile.size ? (uploadedFile.size / 1024 / 1024).toFixed(2) : '0.00'} MB
                </Text>
              </View>
              <TouchableOpacity 
                style={styles.removeFileButton}
                onPress={() => setUploadedFile(null)}
              >
                <Ionicons name="close-circle" size={24} color="#ef4444" />
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <Ionicons name="cloud-upload-outline" size={40} color="#6b7280" />
              <Text style={styles.uploadTitle}>Upload a file</Text>
              <Text style={styles.uploadSubtitle}>PNG, JPG, GIF up to 10MB</Text>
            </>
          )}
        </TouchableOpacity>
      </View>


      {/* Eligibility */}
      <Label text="Eligibility" />
      <TextInput placeholder="e.g., Open to all college students" style={styles.input} value={form.eligibility} onChangeText={(t) => onChange('eligibility', t)} />

      {/* Date */}
      <Label text="Date" />
      <View style={styles.inputContainer}>
        <TextInput
          value={form.date}
          onChangeText={(text) => onChange('date', text)}
          placeholder="dd-mm-yyyy"
          style={styles.inputWithIcon}
        />
        <TouchableOpacity 
          onPress={handleDatePress}
          style={styles.iconContainer}
        >
          <Ionicons name="calendar-outline" size={20} color="#6b7280" />
        </TouchableOpacity>
      </View>

      {/* Time row */}
      <View style={styles.row}>
        <View style={[styles.flexItem, { marginRight: 8 }]}> 
          <Label text="Start Time" />
          <View style={styles.inputContainer}>
            <TextInput
              value={form.startTime}
              onChangeText={(text) => onChange('startTime', text)}
              placeholder="--:-- --"
              style={styles.inputWithIcon}
            />
            <TouchableOpacity 
              onPress={() => handleTimePress('start')}
              style={styles.iconContainer}
            >
              <Ionicons name="time-outline" size={20} color="#6b7280" />
            </TouchableOpacity>
          </View>
        </View>
        <View style={[styles.flexItem, { marginLeft: 8 }]}> 
          <Label text="End Time" />
          <View style={styles.inputContainer}>
            <TextInput
              value={form.endTime}
              onChangeText={(text) => onChange('endTime', text)}
              placeholder="--:-- --"
              style={styles.inputWithIcon}
            />
            <TouchableOpacity 
              onPress={() => handleTimePress('end')}
              style={styles.iconContainer}
            >
              <Ionicons name="time-outline" size={20} color="#6b7280" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Mode */}
      <Label text="Mode" />
      <View style={styles.pillRow}>
        {MODES.map((m) => (
          <Pressable key={m} style={[styles.pill, form.mode === m && styles.pillActive]} onPress={() => onChange('mode', m)}>
            <Text style={[styles.pillText, form.mode === m && styles.pillTextActive]}>{m}</Text>
          </Pressable>
        ))}
      </View>

      {/* Event Type */}
      <Label text="Event Type" />
      <View style={{ height: 4 }} />
      <View style={styles.typeRow}>
        {EVENT_TYPES.map((t) => (
          <Pressable key={t} style={[styles.typePill, form.type === t && styles.typePillActive]} onPress={() => onChange('type', t)}>
            <Text style={[styles.typePillText, form.type === t && styles.typePillTextActive]}>{t}</Text>
          </Pressable>
        ))}
      </View>

      {/* Venue */}
      <Label text="Venue" />
      <TextInput placeholder="Enter venue" style={styles.input} value={form.venue} onChangeText={(t) => onChange('venue', t)} />

      {/* Entry Fee */}
      <Label text="Entry Fee (in ₹)" />
      <TextInput
        placeholder="Enter amount or 0 for free entry"
        keyboardType="numeric"
        style={styles.input}
        value={form.fee}
        onChangeText={(t) => {
          const { sanitized, error } = sanitizeAndValidateNumber(t)
          onChange('fee', sanitized)
          setErrors((prev) => ({ ...prev, fee: error }))
        }}
      />
      {!!errors.fee && <Text style={styles.errorText}>{errors.fee}</Text>}

      {/* Organizers */}
      <Label text="Organizers" />
      {form.organizers.map((org, idx) => (
        <View key={idx} style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>{`Organizer ${idx + 1}`}</Text>
            {form.organizers.length > 1 && (
              <Pressable onPress={() => removeOrganizer(idx)}>
                <Text style={styles.removeText}>Remove</Text>
              </Pressable>
            )}
          </View>
          <Label text="Parent Organization" />
          <TextInput
            placeholder="e.g., College Name"
            style={styles.input}
            value={org.parentOrganization}
            onChangeText={(t) => updateOrganizer(idx, 'parentOrganization', t)}
          />
          <Label text="Event Organizer" />
          <TextInput
            placeholder="e.g., Student Council"
            style={styles.input}
            value={org.eventOrganizer}
            onChangeText={(t) => updateOrganizer(idx, 'eventOrganizer', t)}
          />
        </View>
      ))}
      <Pressable style={styles.addBtn} onPress={addOrganizer}>
        <Text style={styles.addBtnText}>+ Add Organizer</Text>
      </Pressable>

      {/* Points of Contact */}
      <Label text="Points of Contact" />
      {form.contacts.map((c, idx) => (
        <View key={idx} style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>{`Contact ${idx + 1}`}</Text>
            {form.contacts.length > 1 && (
              <Pressable onPress={() => removeContact(idx)}>
                <Text style={styles.removeText}>Remove</Text>
              </Pressable>
            )}
          </View>
          <Label text="Name" />
          <TextInput placeholder="Enter name" style={styles.input} value={c.name} onChangeText={(t) => updateContact(idx, 'name', t)} />
          <Label text="Role" />
          <TextInput placeholder="e.g., Event Coordinator" style={styles.input} value={c.role} onChangeText={(t) => updateContact(idx, 'role', t)} />
          <Label text="Contact Number" />
          <TextInput
            placeholder="Enter contact number"
            keyboardType="phone-pad"
            style={styles.input}
            value={c.phone}
            onChangeText={(t) => {
              const { sanitized, error } = sanitizeAndValidatePhone(t)
              updateContact(idx, 'phone', sanitized)
              setErrors((prev) => {
                const next = [...(prev.contactPhones || [])]
                next[idx] = error
                return { ...prev, contactPhones: next }
              })
            }}
          />
          {!!(errors.contactPhones && errors.contactPhones[idx]) && (
            <Text style={styles.errorText}>{errors.contactPhones[idx]}</Text>
          )}
        </View>
      ))}
      <Pressable style={styles.addBtn} onPress={addContact}>
        <Text style={styles.addBtnText}>+ Add Contact</Text>
      </Pressable>

      {/* Registration Link */}
      <Label text="Registration Link" />
      <TextInput placeholder="Enter registration link" style={styles.input} value={form.registrationLink} onChangeText={(t) => onChange('registrationLink', t)} />

        {/* Date Picker Modal */}
      <Modal
        visible={showDatePicker}
        transparent={true}
        animationType="slide"
        onRequestClose={handleDateCancel}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <ThemedText title style={styles.modalTitle}>Select Date</ThemedText>
              <TouchableOpacity onPress={handleDateCancel}>
                <Ionicons name="close" size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.calendarContainer}>
              <View style={styles.calendarHeader}>
                <TouchableOpacity 
                  style={styles.monthNavButton} 
                  onPress={handlePreviousMonth}
                >
                  <Ionicons 
                    name="chevron-back" 
                    size={24} 
                    color="#6b7280"
                  />
                </TouchableOpacity>
                <ThemedText style={styles.monthYearText}>
                  {calendarMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </ThemedText>
                <TouchableOpacity 
                  style={styles.monthNavButton} 
                  onPress={handleNextMonth}
                >
                  <Ionicons 
                    name="chevron-forward" 
                    size={24} 
                    color="#6b7280"
                  />
                </TouchableOpacity>
              </View>
              
              <View style={styles.weekDaysContainer}>
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <Text key={day} style={styles.weekDayText}>{day}</Text>
                ))}
              </View>
              
              <View style={styles.daysContainer}>
                {getDaysInMonth(calendarMonth).map((day, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => {
                      setSelectedDate(new Date(day.year, day.month, day.date))
                    }}
                    style={[
                      styles.dayButton,
                      day.date === selectedDate.getDate() && 
                      day.month === selectedDate.getMonth() && 
                      day.year === selectedDate.getFullYear() && styles.selectedDay
                    ]}
                  >
                    <Text style={[
                      styles.dayText,
                      !day.isCurrentMonth && styles.otherMonthDay,
                      day.date === selectedDate.getDate() && 
                      day.month === selectedDate.getMonth() && 
                      day.year === selectedDate.getFullYear() && styles.selectedDayText
                    ]}>
                      {day.date}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            <View style={styles.modalFooter}>
              <TouchableOpacity style={styles.cancelButton} onPress={handleDateCancel}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmButton} onPress={handleDateConfirm}>
                <Text style={styles.confirmButtonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Time Picker Modal */}
      <Modal
        visible={showTimePicker}
        transparent={true}
        animationType="slide"
        onRequestClose={handleTimeCancel}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <ThemedText title style={styles.modalTitle}>
                Select {timePickerType === 'start' ? 'Start' : 'End'} Time
              </ThemedText>
              <TouchableOpacity onPress={handleTimeCancel}>
                <Ionicons name="close" size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.timePickerContainer}>
              <View style={styles.timeDisplay}>
                <Text style={styles.timeDisplayText}>
                  {selectedTime.toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit',
                    hour12: true 
                  })}
                </Text>
              </View>
              
              <View style={styles.timeControls}>
                <View style={styles.timeControlRow}>
                  <Text style={styles.timeLabel}>Hour</Text>
                  <View style={styles.timeButtons}>
                    <TouchableOpacity 
                      style={styles.timeButton}
                      onPress={() => {
                        const newTime = new Date(selectedTime)
                        newTime.setHours((selectedTime.getHours() + 1) % 24)
                        setSelectedTime(newTime)
                      }}
                    >
                      <Ionicons name="chevron-up" size={20} color="#6b7280" />
                    </TouchableOpacity>
                    <Text style={styles.timeValue}>
                      {selectedTime.getHours() % 12 || 12}
                    </Text>
                    <TouchableOpacity 
                      style={styles.timeButton}
                      onPress={() => {
                        const newTime = new Date(selectedTime)
                        newTime.setHours((selectedTime.getHours() - 1 + 24) % 24)
                        setSelectedTime(newTime)
                      }}
                    >
                      <Ionicons name="chevron-down" size={20} color="#6b7280" />
                    </TouchableOpacity>
                  </View>
                </View>
                
                <Text style={styles.timeSeparator}>:</Text>
                
                <View style={styles.timeControlRow}>
                  <Text style={styles.timeLabel}>Minute</Text>
                  <View style={styles.timeButtons}>
                    <TouchableOpacity 
                      style={styles.timeButton}
                      onPress={() => {
                        const newTime = new Date(selectedTime)
                        newTime.setMinutes((selectedTime.getMinutes() + 5) % 60)
                        setSelectedTime(newTime)
                      }}
                    >
                      <Ionicons name="chevron-up" size={20} color="#6b7280" />
                    </TouchableOpacity>
                    <Text style={styles.timeValue}>
                      {selectedTime.getMinutes().toString().padStart(2, '0')}
                    </Text>
                    <TouchableOpacity 
                      style={styles.timeButton}
                      onPress={() => {
                        const newTime = new Date(selectedTime)
                        newTime.setMinutes((selectedTime.getMinutes() - 5 + 60) % 60)
                        setSelectedTime(newTime)
                      }}
                    >
                      <Ionicons name="chevron-down" size={20} color="#6b7280" />
                    </TouchableOpacity>
                  </View>
                </View>
                
                <View style={styles.timeControlRow}>
                  <Text style={styles.timeLabel}>AM/PM</Text>
                  <TouchableOpacity 
                    style={styles.ampmButton}
                    onPress={() => {
                      const newTime = new Date(selectedTime)
                      const currentHour = newTime.getHours()
                      if (currentHour < 12) {
                        newTime.setHours(currentHour + 12)
                      } else {
                        newTime.setHours(currentHour - 12)
                      }
                      setSelectedTime(newTime)
                    }}
                  >
                    <Text style={styles.ampmText}>
                      {selectedTime.getHours() >= 12 ? 'PM' : 'AM'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            
            <View style={styles.modalFooter}>
              <TouchableOpacity style={styles.cancelButton} onPress={handleTimeCancel}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmButton} onPress={handleTimeConfirm}>
                <Text style={styles.confirmButtonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Save CTA */}
      <Pressable disabled={submitting || !canSubmit} onPress={onSubmit} style={[styles.publishBtn, (submitting || !canSubmit) && { opacity: 0.6 }]}>
        <Text style={styles.publishText}>Save Changes</Text>
      </Pressable>
    </ScrollView>
  )
}

function Label({ text }: { text: string }) {
  return <Text style={styles.label}>{text}</Text>
}

const FormLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ThemedText style={styles.label}>{children}</ThemedText>
)

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    padding: 16,
  },
  container: { 
    padding: 16, 
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  headerRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    marginBottom: 8 
  },
  title: { 
    fontSize: 20, 
    fontWeight: '700',
    alignItems: 'center'
  },
  linkBack: { 
    color: '#0ea5e9', 
    fontWeight: '600' 
  },
  label: {
    fontSize: 14,
    marginBottom: 6,
    color: '#374151',
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  textarea: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 12,
    minHeight: 100,
    textAlignVertical: 'top',
    backgroundColor: '#fff',
    fontSize: 16,
    lineHeight: 24,
    color: '#111827',
  },
  multiline: {
    minHeight: 100,
    textAlignVertical: 'top',
  },

  uploadTitle: {
    fontWeight: '600',
    marginBottom: 4,
    color: '#111827',
  },
  uploadSubtitle: {
    fontSize: 12,
    color: '#6b7280',
  },

  row2: { flexDirection: 'row', alignItems: 'flex-start', marginTop: 6 },

  pillRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  pill: { paddingHorizontal: 12, paddingVertical: 7, borderRadius: 999, borderWidth: 1, borderColor: '#e2e8f0' },
  pillActive: { backgroundColor: '#fee2e2', borderColor: '#fecaca' },
  pillText: { color: '#334155' },
  pillTextActive: { color: '#991b1b', fontWeight: '800' },

  card: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 12,
    backgroundColor: '#fff',
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  removeText: {
    color: '#991b1b',
    fontWeight: '500',
  },
  addButton: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 8,
    backgroundColor: '#fff',
  },
  addButtonText: {
    fontWeight: '600',
  },

  typeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 6 },
  typePill: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, borderWidth: 1, borderColor: '#e2e8f0' },
  typePillActive: { backgroundColor: '#fee2e2', borderColor: '#fecaca' },
  typePillText: { color: '#334155' },
  typePillTextActive: { color: '#991b1b', fontWeight: '800' },

  publishBtn: {
    marginTop: 16,
    backgroundColor: '#9e0202',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  publishText: { color: '#fff', fontWeight: '900' },
  errorText: { color: '#b91c1c', marginTop: 6 },

  // Modal styles

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    width: '90%',
    maxWidth: 350,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  calendarContainer: {
    padding: 16,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  monthNavButton: {
    padding: 8,
    borderRadius: 8,
  },
  monthYearText: {
    fontSize: 16,
    fontWeight: '600',
  },
  weekDaysContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  weekDayText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
  },
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayButton: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 40,
  },
  dayText: {
    fontSize: 14,
    color: '#374151',
  },
  otherMonthDay: {
    color: '#d1d5db',
  },
  selectedDay: {
    backgroundColor: '#991b1b',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedDayText: {
    color: '#fff',
    fontWeight: '600',
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    marginRight: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#6b7280',
    fontWeight: '600',
  },
  confirmButton: {
    flex: 1,
    paddingVertical: 12,
    marginLeft: 8,
    borderRadius: 8,
    backgroundColor: '#991b1b',
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  
  // Time Picker styles

  timePickerContainer: {
    padding: 16,
    alignItems: 'center',
  },
  timeDisplay: {
    marginBottom: 24,
    padding: 20,
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    minWidth: 120,
    alignItems: 'center',
  },
  timeDisplayText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#374151', 
  },
  timeControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeControlRow: {
    alignItems: 'center',
    marginHorizontal: 8,
  },
  timeLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 8,
  },
  timeButtons: {
    alignItems: 'center',
  },
  timeButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginVertical: 2,
  },
  timeValue: {
    fontSize: 20,
    fontWeight: '600',
    color: '#374151',
    marginVertical: 8,
    minWidth: 30,
    textAlign: 'center',
  },
  timeSeparator: {
    fontSize: 24,
    fontWeight: '600',
    color: '#374151',
    marginHorizontal: 8,
    marginTop: 20,
  },
  ampmButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#991b1b',
    marginTop: 8,
  },
  ampmText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  // File Upload Styles
  uploadBox: {
    height: 140,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#d1d5db',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fafafa',
  },

  uploadedFileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  uploadedImage: {
    width: 50,
    height: 50,
    borderRadius: 4,
    marginRight: 12,
  },
  fileInfo: {
    flex: 1,
  },
  fileName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1f2937',
    marginBottom: 4,
  },
  // Using uploadSubtitle style for file size text
  removeFileButton: {
    padding: 4,
  },
  
  row: {
    flexDirection: 'row',
    marginTop: 16,
  },
  
  // Date/Time Picker Styles
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  inputWithIcon: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#111827',
  },
  iconContainer: {
    padding: 12,
    borderLeftWidth: 1,
    borderLeftColor: '#e5e7eb',
    backgroundColor: '#f9fafb',
  },
  flexItem: {
    flex: 1,
  },
  addBtn: {
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 8,
    backgroundColor: '#fff',
  },
  addBtnText: {
    fontWeight: '600',
    

  },
})


