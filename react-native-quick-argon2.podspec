require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
  s.name         = "react-native-quick-argon2"
  s.version      = package["version"]
  s.summary      = package["description"]
  s.homepage     = package["homepage"]
  s.license      = package["license"]
  s.authors      = package["author"]

  s.platforms    = { :ios => "11.0", :tvos => "12.0", :osx => "10.14" }
  s.source       = { :git => "https://github.com/XantreGodlike/react-native-quick-argon2.git", :tag => "#{s.version}" }

  s.source_files = 
    "ios/**/*.{h,m,mm}",
    "cpp/**/*.{h,cpp}",
    'argon2/src/argon2.c',
    'argon2/src/core.{c,h}',
    'argon2/src/thread.{c,h}',
    'argon2/src/encoding.{c,h}',
    'argon2/src/blake2/blake2.h',
    'argon2/src/blake2/blake2b.c',
    'argon2/src/blake2/blake2-impl.h',
    'argon2/include/**/*.h'
  s.osx.source_files =
    'argon2/src/opt.c',
    'argon2/src/blake2/blamka-round-opt.h'
  s.ios.source_files =
    'argon2/src/ref.c',
    'argon2/src/blake2/blamka-round-ref.h'
  s.tvos.source_files =
    'argon2/src/ref.c',
    'argon2/src/blake2/blamka-round-ref.h'
  s.watchos.source_files =
    'argon2/src/ref.c',
    'argon2/src/blake2/blamka-round-ref.h'
  s.preserve_paths = "argon2/**/*.{h,cpp}"

  s.pod_target_xcconfig    = {
    "USE_HEADERMAP" => "YES",
    "HEADER_SEARCH_PATHS" => "\"$(PODS_TARGET_SRCROOT)/ReactCommon\" \"$(PODS_TARGET_SRCROOT)\"  \"$(PODS_ROOT)/boost\" \"$(PODS_ROOT)/boost-for-react-native\" \"$(PODS_ROOT)/DoubleConversion\" \"$(PODS_ROOT)/Headers/Private/React-Core\" "
  }
  s.xcconfig               = {
    "CLANG_CXX_LANGUAGE_STANDARD" => "c++17",
    "HEADER_SEARCH_PATHS" => "\"$(PODS_ROOT)/boost\" \"$(PODS_ROOT)/boost-for-react-native\" \"$(PODS_ROOT)/glog\"  \"${PODS_ROOT}/Headers/Public/React-hermes\" \"${PODS_ROOT}/Headers/Public/hermes-engine\""
  }

  s.dependency "React-Core"
  s.dependency "React"
  s.dependency "React-callinvoker"
end
