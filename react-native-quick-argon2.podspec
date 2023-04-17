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

  s.source_files = "ios/**/*.{h,m,mm}", "cpp/**/*.{h,cpp}", "argon2/**/*.{h,cpp}"
  s.preserve_paths = "argon2/**/*.{h,cpp}"
  s.prepare_command = <<-CMD
    # Check if the C compiler supports -march=native
    echo "int main() { return 0; }" > check.c
    if #{ENV['CC']} -march=native -o check.o -c check.c >/dev/null 2>&1; then
      echo "COMPILER_SUPPORTS_MARCH_NATIVE=1" > flags.xcconfig
      echo "GCC_PREPROCESSOR_DEFINITIONS = -march=native" >> flags.xcconfig
    else
      echo "COMPILER_SUPPORTS_MARCH_NATIVE=0" > flags.xcconfig
    fi
    rm check.c check.o
  CMD

  s.xcconfig = {
    'GCC_C_LANGUAGE_STANDARD' => 'c89',
    "CLANG_CXX_LANGUAGE_STANDARD" => "c++17",
    'COMPILER_FLAGS_FILE' => '${PODS_TARGET_SRCROOT}/flags.xcconfig',
    "HEADER_SEARCH_PATHS" => "\"$(PODS_TARGET_SRCROOT)/ReactCommon\" \"$(PODS_TARGET_SRCROOT)\"  \"$(PODS_ROOT)/boost\" \"$(PODS_ROOT)/boost-for-react-native\" \"$(PODS_ROOT)/DoubleConversion\" \"$(PODS_ROOT)/Headers/Private/React-Core\" "
  }

  s.dependency "React-Core"
  s.dependency "React"
  s.dependency "React-callinvoker"
end
