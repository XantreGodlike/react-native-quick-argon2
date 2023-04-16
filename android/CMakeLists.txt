project(react-native-quick-argon2)
cmake_minimum_required(VERSION 3.9.0)

set(PACKAGE_NAME "reactnativequickargon2")
set(BUILD_DIR ${CMAKE_SOURCE_DIR}/build)
set(CMAKE_CXX_STANDARD 17)


find_package(fbjni REQUIRED CONFIG)
find_package(ReactAndroid REQUIRED CONFIG)

# BOLIDERPLATE START
include_directories(
        ./cpp
        ../cpp
        ../argon2/include
        "${NODE_MODULES_DIR}/react-native/ReactAndroid/src/main/jni/react/turbomodule"
        "${NODE_MODULES_DIR}/react-native/ReactCommon"
        "${NODE_MODULES_DIR}/react-native/ReactCommon/callinvoker"
        "${NODE_MODULES_DIR}/react-native/ReactCommon/jsi"
        "${NODE_MODULES_DIR}/react-native/ReactCommon/turbomodule/core"
        "${NODE_MODULES_DIR}/react-native/ReactCommon/react/nativemodule/core"
)
# BOLIDERPLATE END

# ARGON2
set(CMAKE_C_STANDARD 89)
set(CMAKE_C_STANDARD_REQUIRED ON)
set(CMAKE_C_EXTENSIONS OFF)

include(CheckCXXCompilerFlag)
check_cxx_compiler_flag("-march=native" COMPILER_SUPPORTS_MARCH_NATIVE)

if(COMPILER_SUPPORTS_MARCH_NATIVE)
    set(ARGON2_IMPL ../argon2/src/opt.c)
    add_definitions(-march=native)
else()
    set(ARGON2_IMPL ../argon2/src/ref.c)
endif()

set(ARGON2_SRC
    ../argon2/src/argon2.c
    ../argon2/src/core.c
    ../argon2/src/blake2/blake2b.c
    ../argon2/src/thread.c
    ../argon2/src/encoding.c
    ${ARGON2_IMPL}
)

add_library(argon2 STATIC ${ARGON2_SRC})

target_include_directories(argon2 PUBLIC ../argon2/include)
target_include_directories(argon2 PRIVATE ../argon2/src)

set_target_properties(argon2 PROPERTIES
    C_STANDARD 90
    C_STANDARD_REQUIRED ON
    C_EXTENSIONS OFF
)
# END ARGON2



add_library(
  ${PACKAGE_NAME}  # <-- Library name
  SHARED
  src/main/cpp/cpp-adapter.cpp
  ../cpp/RNA2Argon2.cpp
  ../cpp/RNA2QuickArgon2HostObject.cpp
  ../cpp/JSIUtils/RNA2DispatchQueue.cpp
  ../cpp/JSIUtils/RNA2SmartHostObject.cpp
  ../cpp/JSIUtils/RNA2ThreadAwareHostObject.cpp
  ../cpp/JSIUtils/RNA2TypedArray.cpp

)

set_target_properties(
        ${PACKAGE_NAME}
        PROPERTIES
        CXX_STANDARD 17
        CXX_EXTENSIONS OFF
        POSITION_INDEPENDENT_CODE ON
)

file(GLOB LIBRN_DIR "${BUILD_DIR}/react-native-0*/jni/${ANDROID_ABI}")

find_library(
        log-lib
        log
)


target_link_libraries(
        ${PACKAGE_NAME}
        argon2
        ReactAndroid::turbomodulejsijni
        fbjni::fbjni
        ${log-lib}
        ReactAndroid::jsi
        ReactAndroid::reactnativejni
        ReactAndroid::react_nativemodule_core
        android
)
